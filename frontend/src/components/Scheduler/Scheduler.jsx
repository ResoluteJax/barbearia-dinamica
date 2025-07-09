import React, { useState, useEffect } from 'react';
import { getServices, getAvailability, createAppointment } from '../../services/api';
import { format, isToday } from 'date-fns';
import { FaCut, FaCalendarAlt, FaUserEdit, FaArrowLeft } from 'react-icons/fa';
import ApprovedReviews from '../ApprovedReviews/ApprovedReviews';
import './Scheduler.scss';

// Gera todos os horários possíveis para um dia de trabalho
const generateDayTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 18; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
    if (hour < 17) {
      slots.push(`${String(hour).padStart(2, '0')}:30`);
    }
  }
  return slots;
};

const allDaySlots = generateDayTimeSlots();

const Scheduler = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Busca os serviços ao carregar o componente
  useEffect(() => {
    getServices()
      .then(response => {
        setServices(response.data);
      })
      .catch(error => console.error('Erro ao buscar serviços:', error));
  }, []);

  // Busca a disponibilidade
  useEffect(() => {
    if (selectedService) {
      setLoading(true);
      setAvailableTimes([]);
      setSelectedTime(null);
      getAvailability(selectedDate, selectedService.durationInMinutes)
        .then(response => {
          setAvailableTimes(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar disponibilidade:', error);
          setError('Não foi possível buscar os horários.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedDate, selectedService]);

  const handleDateChange = (event) => {
    const date = new Date(event.target.value.replace(/-/g, '/'));
    setSelectedDate(date);
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setCurrentStep(2);
  };
  
  const handleSelectTime = (time) => {
    setSelectedTime(time);
    setCurrentStep(3);
  };

  const goBack = () => {
    setError('');
    setSuccess('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitBooking = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!selectedService || !selectedDate || !selectedTime || !customerName || !customerPhone) {
      setError('Por favor, preencha todos os campos para agendar.');
      setLoading(false);
      return;
    }

    const [hour, minute] = selectedTime.split(':');
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(hour, minute, 0, 0);

    const appointmentData = {
      customerName,
      customerPhone,
      serviceId: selectedService.id,
      date: appointmentDate.toISOString(),
    };

    try {
      await createAppointment(appointmentData);
      setSuccess('Agendamento realizado com sucesso! Você receberá uma confirmação e um lembrete no WhatsApp.');
      
      setLoading(true);
      getAvailability(selectedDate, selectedService.durationInMinutes)
        .then(response => setAvailableTimes(response.data))
        .catch(err => console.error("Falha ao recarregar horários", err))
        .finally(() => setLoading(false));

      setSelectedTime(null);
      setCustomerName('');
      setCustomerPhone('');
      setCurrentStep(2);

    } catch (err) {
      setError(err.response?.data?.message || 'Falha ao realizar o agendamento. Tente outro horário.');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="scheduler-container modern" data-step={currentStep}>
        <div className="stepper">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-icon"><FaCut /></div>
            <div className="step-label">Serviço</div>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-icon"><FaCalendarAlt /></div>
            <div className="step-label">Data & Hora</div>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-icon"><FaUserEdit /></div>
            <div className="step-label">Seus Dados</div>
          </div>
        </div>
        
        <div className="back-button-wrapper">
          {currentStep > 1 && (
            <button type="button" onClick={goBack} className="back-button">
              <FaArrowLeft /> Voltar
            </button>
          )}
        </div>

        <div className="form-wrapper">
          <form onSubmit={handleSubmitBooking}>
            <div className='step-content'>
              <h2>1. Escolha o Serviço</h2>
              <div className="services-list">
                {services.map(service => (
                  <button type="button" key={service.id} className={selectedService?.id === service.id ? 'selected' : ''} onClick={() => handleSelectService(service)}>
                    {service.name} <span>({service.durationInMinutes} min) - R$ {Number(service.price).toFixed(2).replace('.',',')}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className='step-content'>
              <h2>2. Escolha a Data e Horário</h2>
              <div className="date-time-picker">
                <div className="date-selector">
                  <label htmlFor="date">Data:</label>
                  <input type="date" id="date" value={format(selectedDate, 'yyyy-MM-dd')} onChange={handleDateChange} />
                </div>
                <div className="time-selector">
                  <h3>Horários para {format(selectedDate, 'dd/MM/yyyy')}</h3>
                  {loading && !services.length ? <p>Carregando...</p> : loading ? <p>Buscando horários...</p> : (
                    <div className="time-slots">
                      {allDaySlots.map(time => {
                        const now = new Date();
                        const [hour, minute] = time.split(':');
                        const slotTime = new Date(selectedDate);
                        slotTime.setHours(hour, minute, 0, 0);
                        
                        const isPast = isToday(selectedDate) && now > slotTime;
                        const isAvailable = availableTimes.includes(time);
                        const isDisabled = isPast || !isAvailable;

                        let btnClass = '';
                        if (selectedTime === time) {
                          btnClass = 'selected';
                        } else if (isPast) {
                          btnClass = 'disabled-past';
                        } else if (!isAvailable) {
                          btnClass = 'disabled-unavailable';
                        }

                        return (
                          <button 
                            type="button"
                            key={time}
                            disabled={isDisabled} 
                            className={btnClass}
                            onClick={() => handleSelectTime(time)}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='step-content'>
              <h2>3. Confirme Seus Dados</h2>
              <div className="customer-details">
                <div className="form-group">
                  <label htmlFor="name">Seu Nome Completo</label>
                  <input type="text" id="name" value={customerName} onChange={e => setCustomerName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Seu WhatsApp (com código do país e DDD)</label>
                  <input type="text" id="phone" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="+5521999999999" required />
                </div>
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? 'Confirmando...' : 'Confirmar Agendamento'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
      
      <ApprovedReviews />
    </>
  );
};

export default Scheduler;