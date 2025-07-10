// backend/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o processo de seed...');

  // Limpa dados antigos em uma ordem segura para evitar erros de chave estrangeira
  console.log('Deletando dados antigos...');
  await prisma.appointment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.portfolioImage.deleteMany();
  await prisma.user.deleteMany();
  await prisma.service.deleteMany();
  console.log('Dados antigos deletados com sucesso.');

  // Cria o usuário admin
  console.log('Criando usuário admin...');
  const hashedPassword = await bcrypt.hash('1411', 10); // Usando a senha que definimos
  await prisma.user.create({
    data: {
      name: "D'Castro Barbeiro",
      email: 'admin@dcastrobarbearia.com',
      password: hashedPassword,
    },
  });
  console.log('Usuário admin criado.');

  // Cria a nova lista de serviços da D'Castro Barbearia
  console.log('Criando nova lista de serviços...');
  await prisma.service.createMany({
    data: [
      { name: 'Corte Disfarce Navalhado', price: 30.00, durationInMinutes: 45 },
      { name: 'Corte Simples (Máquina)', price: 15.00, durationInMinutes: 20 },
      { name: 'Corte (Máquina e Tesoura)', price: 35.00, durationInMinutes: 30 },
      { name: 'Corte com Barba', price: 40.00, durationInMinutes: 60 },
      { name: 'Corte com Cavanhaque', price: 40.00, durationInMinutes: 50 },
      { name: 'Acabamento (Pezinho + Pente)', price: 10.00, durationInMinutes: 15 }, // Preço e tempo estimados
      { name: 'Tinta Preta (Aplicação)', price: 10.00, durationInMinutes: 45 },
      { name: 'Reflexo com Corte', price: 70.00, durationInMinutes: 90 },
      { name: 'Nevou com Corte', price: 70.00, durationInMinutes: 120 },
      { name: 'Tinta Colorida com Corte', price: 80.00, durationInMinutes: 100 },
      { name: 'Corte Infantil (1 a 5 anos)', price: 40.00, durationInMinutes: 30 },
    ],
  });
  console.log('Nova lista de serviços criada com sucesso.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed finalizado com sucesso.');
  })
  .catch(async (e) => {
    console.error('Erro durante o processo de seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });