import { PrismaClient } from "@prisma/client";
// import type { Week, Dinner } from '@prisma/client'

const prisma = new PrismaClient();

let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
async function main() {
  // // create dinners
  
  // // for (let i = 0; i < 7; i++) {
  // //   let day = 25 + i
  // //   let name = days[i]
  // //   let date = new Date(Date.UTC(2023, 7, day))
  // //   const dinner = await prisma.dinner.create({
  // //     data: {
  // //       date: date,
  // //       name: name,
  // //       userIDs: ['64bea046e8dcc972100063f8']
  // //     }
  // //   })
  // // }

  // const dinner = await prisma.dinner.create({
  //   data: {
  //     date: new Date(Date.UTC(2023, 7, 24)),
  //     name: 'Monday',
  //   },
  // })

  // console.log(dinner)

  // const updateDinner = await prisma.dinner.update({
  //   where: {id: '64bea0ab6000724b1c584137'},
  //   data: {userIDs: ['64bea046e8dcc972100063f8']}
  // })

  // console.log(updateDinner)
  const dinners = await prisma.dinner.updateMany({
    data: {
      userIDs: '64bea046e8dcc972100063f8'
    }
  })
  console.log(dinners)


  // const user = await prisma.user.create({
  //   data: {
  //     name: "Jonny",
  //     email: "jonathan.wei.liang@gmail.com",
  //   },
  // });
  // console.log(user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
