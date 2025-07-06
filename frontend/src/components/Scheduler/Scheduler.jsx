// frontend/src/components/Scheduler/Scheduler.jsx
import React, { useState, useEffect } from 'react';
import { getServices, getAvailability, createAppointment } from '../../services/api';
import { format, parse } from 'date-fns';
import './Scheduler.scss';

const Scheduler = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  // Novos estados para os dados do cliente
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getServices()
      .then(response => setServices(response.data))
      .catch(error => console.error('Erro ao buscar serviços:', error));
  }, []);

  useEffect(() => {
    setLoading(true);
    setSelectedTime(null);
    getAvailability(selectedDate)
      .then(response => setAvailableTimes(response.data))
      .catch(error => console.error('Erro ao buscar disponibilidade:', error))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  const handleDateChange = (event) => {
    const date = new Date(event.target.value.replace(/-/g, '/'));
    setSelectedDate(date);
  };

  const handleSubmitBooking = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedService || !selectedDate || !selectedTime || !customerName || !customerPhone) {
      setError('Por favor, preencha todos os campos para agendar.');
      return;
    }

    // Combina a data e a hora selecionadas em um único objeto Date
    const timeParts = selectedTime.split(':');
    const appointmentDate = new Date(selectedDate.setHours(timeParts[0], timeParts[1], 0, 0));

    const appointmentData = {
      customerName,
      customerPhone,
      serviceId: selectedService.id,
      date: appointmentDate.toISOString(), // Envia a data no formato ISO
    };

    try {
      await createAppointment(appointmentData);
      setSuccess('Agendamento realizado com sucesso! Você receberá um lembrete no WhatsApp.');
      // Limpa o formulário
      setSelectedService(null);
      setSelectedTime(null);
      setCustomerName('');
      setCustomerPhone('');
    } catch (err) {
      setError(err.response?.data?.message || 'Falha ao realizar o agendamento. Tente outro horário.');
    }
  };

  return (
    <div className="scheduler-container">
      <form onSubmit={handleSubmitBooking}>
        {/* Seção 1: Serviços */}
        <h2>1. Escolha o Serviço</h2>
        <div className="services-list">
          {services.map(service => (
            <button 
              type="button" // Impede que o botão submeta o formulário
              key={service.id} 
              className={selectedService?.id === service.id ? 'selected' : ''}
              onClick={() => setSelectedService(service)}
            >
              {service.name} - R$ {Number(service.price).toFixed(2)}
            </button>
          ))}
        </div>

        {/* Seção 2: Data e Hora */}
        <h2>2. Escolha a Data e Horário</h2>
        <div className="date-time-picker">
          <div className="date-selector">
            <label htmlFor="date">Data:</label>
            <input 
              type="date" 
              id="date" 
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={handleDateChange}
            />
          </div>
          <div className="time-selector">
            <h3>Horários Disponíveis para {format(selectedDate, 'dd/MM/yyyy')}</h3>
            {loading ? <p>Carregando horários...</p> : (
              <div className="time-slots">
                {availableTimes.length > 0 ? (
                  availableTimes.map(time => (
                    <button 
                      type="button"
                      key={time}
                      className={selectedTime === time ? 'selected' : ''}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))
                ) : <p>Nenhum horário disponível para esta data.</p>}
              </div>
            )}
          </div>
        </div>

        {/* Seção 3: Dados do Cliente e Botão Final */}
        {selectedService && selectedTime && (
          <div className="customer-details">
            <h2>3. Confirme Seus Dados</h2>
            <div className="form-group">
              <label htmlFor="name">Seu Nome</label>
              <input type="text" id="name" value={customerName} onChange={e => setCustomerName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Seu WhatsApp (com DDD)</label>
              <input type="text" id="phone" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="+5521999999999" required />
            </div>
            <button type="submit" className="submit-booking-btn">
              Confirmar Agendamento
            </button>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
};

export default Scheduler;