const prisma = require("../prisma");
const seed = async () => {
  
    const createPickups = async () => {
        const pickups = [
            {name: "Johnny", phoneNumber: "(714) 478-2897", items: "black couch", image: "https://mobileimages.lowes.com/productimages/474d2d16-2ae4-4a18-8ad7-ca6a469f8cb4/69461759.jpeg?size=xl", notes: "Has attached ottoman", pickupDate: new Date (2025, 3, 19)},
            {name: "Tammy", phoneNumber: "(714) 245-6787", items: "brown couch", image: "https://m.media-amazon.com/images/I/71IRzkMUakL._AC_UF894,1000_QL80_.jpg", notes: "Leather", pickupDate: new Date (2025, 3, 18)}
        ]
        await prisma.pickup.createMany({data: pickups})
    };

    const createDeliveries = async () => {
        const deliveries = [
            {name: "Kim", phoneNumber: "(562) 201-9898", address: "1003 S Beacon St San Pedro, CA 90731", items: "fridge", image: "https://image-us.samsung.com/SamsungUS/home/home-appliances/refrigerators/4-door-french-door/pdp/rf24r7201sr-aa/gallery/01-7201-stainless-022019.jpg?$product-details-jpg$", notes: "samsung", deliveryDate: new Date (2025, 3, 20)},
            {name: "Fidias", phoneNumber: "(661) 945-3234", address: "2342 S Rushmore St Long Beach, CA 90731", items: "washer", image: "https://image-us.samsung.com/SamsungUS/home/home-appliances/washers/front-load/pd/wf45t6000aw-a5/gallery/Gallery-WF45T6000AW-01-White-1600x1200.jpg?$product-details-jpg$", notes: "white", deliveryDate: new Date (2025, 3, 22)},
        ]
        await prisma.delivery.createMany({data: deliveries})
        
    }
        const createUsers = async () => {
            const users = [
                {username: "beaconboy", password: "beacon"}
            ]
            await prisma.user.createMany({data: users})       
    };

    await createPickups();
    await createDeliveries();
    await createUsers();
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });