// frontend/src/components/Scheduler/Scheduler.jsx
import React, { useState, useEffect } from 'react';
import { getServices, getAvailability } from '../../services/api';
import { format, addDays } from 'date-fns';
import './Scheduler.scss'; // Importaremos o estilo aqui

const Scheduler = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);

  const [loading, setLoading] = useState(false);

  // Efeito para buscar os serviços quando o componente montar
  useEffect(() => {
    getServices()
      .then(response => {
        setServices(response.data);
      })
      .catch(error => console.error('Erro ao buscar serviços:', error));
  }, []);

  // Efeito para buscar a disponibilidade sempre que a data mudar
  useEffect(() => {
    setLoading(true);
    getAvailability(selectedDate)
      .then(response => {
        setAvailableTimes(response.data);
      })
      .catch(error => console.error('Erro ao buscar disponibilidade:', error))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  const handleDateChange = (event) => {
    // Adiciona o fuso horário para evitar problemas de um dia a menos
    const date = new Date(event.target.value.replace(/-/g, '/'));
    setSelectedDate(date);
  };

  return (
    <div className="scheduler-container">
      <h2>1. Escolha o Serviço</h2>
      <div className="services-list">
        {services.map(service => (
          <button key={service.id} onClick={() => setSelectedService(service)}>
            {service.name} - R$ {service.price}
          </button>
        ))}
      </div>

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
          {loading ? (
            <p>Carregando horários...</p>
          ) : (
            <div className="time-slots">
              {availableTimes.length > 0 ? (
                availableTimes.map(time => (
                  <button key={time}>{time}</button>
                ))
              ) : (
                <p>Nenhum horário disponível para esta data.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scheduler;