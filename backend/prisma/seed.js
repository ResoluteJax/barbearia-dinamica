// backend/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Limpa dados antigos
  await prisma.appointment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.service.deleteMany();
  console.log('Dados antigos deletados.');

  // Cria usuário barbeiro com senha hasheada
  const hashedPassword = await bcrypt.hash('senha123', 10);
  await prisma.user.create({
    data: {
      name: 'Barbeiro Admin',
      email: 'admin@barbearia.com',
      password: hashedPassword,
    },
  });
  console.log('Usuário admin criado com sucesso.');

  // Cria novos serviços
  await prisma.service.createMany({
    data: [
      { name: 'Corte de Cabelo', description: 'Corte moderno com tesoura e máquina.', price: 40.00, durationInMinutes: 30 },
      { name: 'Barba Terapia', description: 'Barba feita com toalha quente e navalha.', price: 35.00, durationInMinutes: 30 },
      { name: 'Corte + Barba', description: 'Pacote completo de corte e barba.', price: 70.00, durationInMinutes: 60 },
      { name: 'Sobrancelha', description: 'Design de sobrancelha na pinça ou cera.', price: 20.00, durationInMinutes: 15 },
    ],
  });
  console.log('Novos serviços criados com sucesso.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });