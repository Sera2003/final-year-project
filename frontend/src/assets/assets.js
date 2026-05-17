import logo from './Logocontext.svg';
import wolflogo from './Logo.svg';
import search_icon from './search.svg';
import profile_icon from './account.svg';
import cart_icon from './cart.svg';
import menu_icon from './menu.svg';
import support_img from './support_img.png'
import quality_icon from './quality_icon.png'
import exchange_icon from './exchange_icon.png'
import dropdown_icon from './arrow-drop-down.svg';
import instagram_icon from './instagram.svg';
import facebook_icon from './Facebook.svg';
import dropdownFilter_icon from './dropdownFilter_icon.png'


import hero_img from './heroimg.jpg';
import topw1 from './women/topw1.png';
import topw1_2 from './women/topw1.2.png';
import topw1_3 from './women/topw1.3.png';
import topw1_4 from './women/topw1.4.png';
import topw2 from './women/topwomen2.jpg';
import topw3 from './women/topwomen3.jpg';
import topw4 from './women/topwomen4.jpg';
import topw5 from './women/topwomen5.jpg';
import topw6 from './women/topwomen6.jpg';
import topw7 from './women/topwomen7.jpg';
import topw8 from './women/topwomen8.jpg';
import topw9 from './women/topwomen9.jpg';
import topw10 from './women/topwomen10.jpg';
import topm1 from './men/topmen1.jpg';
import topm2 from './men/topmen2.jpg';
import topm3 from './men/topmen3.jpg';
import topm4 from './men/topmen4.jpg';
import topm5 from './men/topmen5.jpg';
import topm6 from './men/topmen6.jpg';
import topm7 from './men/topmen7.jpg';
import topm8 from './men/topmen8.jpg';
import topm9 from './men/topmen9.jpg';
import topm10 from './men/topmen10.jpg';
import bottomw1 from './women/bottomwomen1.jpg';
import bottomw2 from './women/bottomwomen2.jpg';
import bottomw3 from './women/bottomwomen3.jpg';
import bottomw4 from './women/bottomwomen4.jpg';
import bottomw5 from './women/bottomwomen5.jpg';
import bottomw6 from './women/bottomwomen6.jpg';
import bottomw7 from './women/bottomwomen7.jpg';
import bottomw8 from './women/bottomwomen8.jpg';
import bottomw9 from './women/bottomwomen9.jpg';
import bottomw10 from './women/bottomwomen10.jpg';
import bottomm1 from './men/bottommen1.jpg';
import bottomm2 from './men/bottommen2.jpg';
import bottomm3 from './men/bottommen3.jpg';
import bottomm4 from './men/bottommen4.jpg';
import bottomm5 from './men/bottommen5.jpg';
import bottomm6 from './men/bottommen6.jpg';
import bottomm7 from './men/bottommen7.jpg';
import bottomm8 from './men/bottommen8.jpg';
import bottomm9 from './men/bottommen9.jpg';
import bottomm10 from './men/bottommen10.jpg';
import setw1 from './women/setwomen1.jpg';
import setw2 from './women/setwomen2.jpg';
import setm1 from './men/setmen1.jpg';
import setm2 from './men/setmen2.jpg';
import gym1 from './accessories/yogamat.jpg';
import gym2 from './accessories/waterbottle.jpg';
import gym3 from './accessories/tuberesistanceband.jpg';
import gym4 from './accessories/sweatbands.jpg';
import gym5 from './accessories/shortband.jpg';
import gym6 from './accessories/massagegun.jpg';
import gym7 from './accessories/liftingbelt.jpg';
import gym8 from './accessories/foamroller.jpg';
import gym9 from './accessories/circlehipband.jpg';
import gym10 from './accessories/abmat.jpg';


import cross_icon from './cross_icon.png';
import star_icon from './star_icon.png';
import star_dull_icon from './star_dull_icon.png';
import bin_icon from './bin_icon.png';
import stripe_logo from'./stripe_logo.png';
import razorpay_logo from'./razorpay_logo.png';
import about_img from './about_img.jpg'
import contact_img from './contact_img.png'

export const assets = {
    wolflogo,
    logo,
    search_icon,
    profile_icon,
    cart_icon,
    menu_icon,
    dropdown_icon,
    hero_img,
    exchange_icon,
    quality_icon,
    support_img,
    instagram_icon,
    facebook_icon,
    dropdownFilter_icon,
    cross_icon,
    star_icon,
    star_dull_icon,
    bin_icon,
    stripe_logo,
    razorpay_logo,
    about_img,
    contact_img,

};

export const products = [
    // Women's Tops (10 items)
    {
        id: "w_top_1",
        name: "Sports Tank Top in DryMove",
        description: "Soft, breathable cotton t-shirt for everyday comfort.",
        price: 10,
        image: [topw1,topw1_2,topw1_3,topw1_4],
        category: "Women",
        subCategory: "Tops",
        sizes: [ "S", "M", "L"],
        date: 1716634345448,
        bestseller: true
    },

    {
        id: "w_top_2",
        name: "Sports Top in DryMove",
        description: "Elegant blouse with delicate detailing.",
        price: 89,
        image: [topw2],
        category: "Women",
        subCategory: "Tops",
        sizes: ["S", "M", "L"],
        date: 1716720745448,
        bestseller: false
    },
    {
        id: "w_top_3",
        name: "Sports Top with DryMove",
        description: "Moisture-wicking crop top for workout and casual wear.",
        price: 45,
        image: [topw3],
        category: "Women",
        subCategory: "Tops",
        sizes: [ "S", "M"],
        date: 1716807145448,
        bestseller: true
    },
    {
        id: "w_top_4",
        name: "Sports Top with DryMove",
        description: "Stretchy ribbed tank top with a modern fit.",
        price: 29,
        image: [topw4],
        category: "Women",
        subCategory: "Tops",
        sizes: [ "S", "M", "L"],
        date: 1716893545448,
        bestseller: false
    },
    {
        id: "w_top_5",
        name: "Sports Top with DryMove",
        description: "Cozy oversized sweater for layering and comfort.",
        price: 65,
        image: [topw5],
        category: "Women",
        subCategory: "Tops",
        sizes: ["S", "M", "L", "XL"],
        date: 1716979945448,
        bestseller: true
    },
    {
        id: "w_top_6",
        name: "Sports Top in DryMove",
        description: "Lightweight linen shirt perfect for summer.",
        price: 79,
        image: [topw6],
        category: "Women",
        subCategory: "Tops",
        sizes: [ "S", "M", "L"],
        date: 1717066345448,
        bestseller: false
    },
    {
        id: "w_top_7",
        name: "DryMove Sports Top",
        description: "Stylish for sunny days.",
        price: 55,
        image: [topw7],
        category: "Women",
        subCategory: "Tops",
        sizes: ["S", "M", "L"],
        date: 1717152745448,
        bestseller: true
    },
    {
        id: "w_top_8",
        name: "DryMove Sports Top",
        description: "Trendy t-shirt with unique graphic print.",
        price: 39,
        image: [topw8],
        category: "Women",
        subCategory: "Tops",
        sizes: ["S", "M", "L"],
        date: 1717239145448,
        bestseller: false
    },
    {
        id: "w_top_9",
        name: "Sports Tank Top in DryMove",
        description: "Flattering wrap-style top for versatile styling.",
        price: 59,
        image: [topw9],
        category: "Women",
        subCategory: "Tops",
        sizes: ["S", "M", "L"],
        date: 1717325545448,
        bestseller: true
    },
    {
        id: "w_top_10",
        name: "Shelf-Bra Sports Top with DryMove",
        description: "Elegant sleeveless blouse for professional settings.",
        price: 69,
        image: [topw10],
        category: "Women",
        subCategory: "Tops",
        sizes: ["S", "M", "L"],
        date: 1717411945448,
        bestseller: false
    },
    // Women's Bottoms (10 items)
    {
        id: "w_bottom_1",
        name: "Flared Leggings",
        description: "Stretchy and comfortable yoga pants with tummy control.",
        price: 59,
        image: [bottomw1],
        category: "Women",
        subCategory: "Bottoms",
        sizes: [ "S", "M", "L"],
        date: 1717498345448,
        bestseller: true
    },
    {
        id: "w_bottom_2",
        name: "Seamless Sports Leggings in DryMove",
        description: "Classic skinny jeans with modern stretch fabric.",
        price: 89,
        image: [bottomw2],
        category: "Women",
        subCategory: "Bottoms",
        sizes: [ "S", "M", "L","XL"],
        date: 1717584745448,
        bestseller: false
    },
    {
        id: "w_bottom_3",
        name: "Flared Yoga Leggings with SoftMove Lycra",
        description: "Functional cargo pants with multiple pockets.",
        price: 75,
        image: [bottomw3],
        category: "Women",
        subCategory: "Bottoms",
        sizes: [ "S", "M", "L"],
        date: 1717671145448,
        bestseller: true
    },
    {
        id: "w_bottom_4",
        name: "Flared Yoga Leggings with SoftMove Lycra",
        description: "Breathable workout shorts with moisture-wicking fabric.",
        price: 45,
        image: [bottomw4],
        category: "Women",
        subCategory: "Bottoms",
        sizes: ["S", "M"],
        date: 1717757545448,
        bestseller: false
    },
    {
        id: "w_bottom_5",
        name: "Yoga Leggings with SoftMove Lycra",
        description: "Elegant wide-leg trousers for professional settings.",
        price: 99,
        image: [bottomw5],
        category: "Women",
        subCategory: "Bottoms",
        sizes: ["S", "M", "L"],
        date: 1717843945448,
        bestseller: true
    },
    {
        id: "w_bottom_6",
        name: "Ankle-Length Yoga Leggings with SoftMove Lycra",
        description: "Soft and stretchy full-length leggings.",
        price: 49,
        image: [bottomw6],
        category: "Women",
        subCategory: "Bottoms",
        sizes: [ "S", "M", "L"],
        date: 1717930345448,
        bestseller: false
    },
    {
        id: "w_bottom_7",
        name: "Yoga Leggings with SoftMove Lycra",
        description: "Classic denim shorts for casual summer days.",
        price: 55,
        image: [bottomw7],
        category: "Women",
        subCategory: "Bottoms",
        sizes: [ "S", "M", "L"],
        date: 1718016745448,
        bestseller: true
    },
    {
        id: "w_bottom_8",
        name: "High Waist Leggings",
        description: "Flowy midi skirt for versatile styling.",
        price: 69,
        image: [bottomw8],
        category: "Women",
        subCategory: "Bottoms",
        sizes: [ "S", "M", "L"],
        date: 1718103145448,
        bestseller: false
    },
    {
        id: "w_bottom_9",
        name: "Sports Leggings with SoftMove",
        description: "Comfortable jogger pants with elastic waistband.",
        price: 65,
        image: [bottomw9],
        category: "Women",
        subCategory: "Bottoms",
        sizes: [ "S", "M", "L"],
        date: 1718189545448,
        bestseller: true
    },
    {
        id: "w_bottom_10",
        name: "Pocket-Detail Sports Leggings with DryMove",
        description: "Sleek and stylish leather-look pants.",
        price: 129,
        image: [bottomw10],
        category: "Women",
        subCategory: "Bottoms",
        sizes: [ "S", "M", "L"],
        date: 1718275945448,
        bestseller: false
    },
    // Men's Tops (10 items)
    {
        id: "m_top_1",
        name: "Muscle-Fit Sports Shirt with DryMove",
        description: "Soft, breathable cotton t-shirt for everyday wear.",
        price: 29,
        image: [topm1],
        category: "Men",
        subCategory: "Tops",
        sizes: ["S", "M", "L", "XL"],
        date: 1718362345448,
        bestseller: true
    },
    {
        id: "m_top_2",
        name: "Regular-Fit Sports Tank Top with DryMove",
        description: "Tank Top with regular fit design.",
        price: 59,
        image: [topm2],
        category: "Men",
        subCategory: "Tops",
        sizes: ["S", "M", "L", "XL"],
        date: 1718448745448,
        bestseller: false
    },
    {
        id: "m_top_3",
        name: "Regular-Fit Sports Shirt with DryMove",
        description: "Moisture-wicking athletic shirt for intense workouts.",
        price: 49,
        image: [topm3],
        category: "Men",
        subCategory: "Tops",
        sizes: ["S", "M", "L", "XL"],
        date: 1718535145448,
        bestseller: true
    },
    {
        id: "m_top_4",
        name: "Regular-Fit Sports Tank Top with DryMove",
        description: "Warm and comfortable tank top shirt.",
        price: 69,
        image: [topm4],
        category: "Men",
        subCategory: "Tops",
        sizes: ["S", "M", "L", "XL"],
        date: 1718621545448,
        bestseller: false
    },
    {
        id: "m_top_5",
        name: "Regular-Fit Sports Shirt with DryMove",
        description: "Comfortable shirt for casual wear.",
        price: 79,
        image: [topm5],
        category: "Men",
        subCategory: "Tops",
        sizes: ["S", "M", "L", "XL"],
        date: 1718707945448,
        bestseller: true
    },
    {
        id: "m_top_6",
        name: "Regular-Fit Sports Shirt with DryMove",
        description: "Casual shirt for regular fit.",
        price: 45,
        image: [topm6],
        category: "Men",
        subCategory: "Tops",
        sizes: ["S", "M", "L", "XL"],
        date: 1718794345448,
        bestseller: false
    },
    {
        id: "m_top_7",
        name: "Regular-Fit Sports Shirt with DryMove",
        description: "Comfortable short sleeve t-shirt.",
        price: 39,
        image: [topm7],
        category: "Men",
        subCategory: "Tops",
        sizes: ["S", "M", "L", "XL"],
        date: 1718880745448,
        bestseller: true
    },
    {
        id: "m_top_8",
        name: "Muscle-Fit Sports Shirt with DryMove",
        description: "Warm drymove shirt for muscle fit.",
        price: 89,
        image: [topm8],
        category: "Men",
        subCategory: "Tops",
        sizes: ["S", "M", "L", "XL"],
        date: 1718967145448,
        bestseller: false
    },
    {
        id: "m_top_9",
        name: "Muscle-Fit Sports Shirt with DryMove",
        description: "Lightweight shirt for workout or casual wear.",
        price: 25,
        image: [topm9],
        category: "Men",
        subCategory: "Tops",
        sizes: ["S", "M", "L", "XL"],
        date: 1719053545448,
        bestseller: true
    },
    {
        id: "m_top_10",
        name: "Regular Fit Sports Shirt in DryMove",
        description: "Regular shirt for sport and casual occasions.",
        price: 69,
        image: [topm10],
        category: "Men",
        subCategory: "Tops",
        sizes: ["S", "M", "L", "XL"],
        date: 1719139945448,
        bestseller: false
    },
    // Men's Bottoms (10 items)
    {
        id: "m_bottom_1",
        name: "Regular Fit Sports Joggers",
        description: "Comfortable jogger pants with elastic waistband.",
        price: 59,
        image: [bottomm1],
        category: "Men",
        subCategory: "Bottoms",
        sizes: ["S", "M", "L", "XL"],
        date: 1719226345448,
        bestseller: true
    },
    {
        id: "m_bottom_2",
        name: "Slim-Fit Sports Joggers with DryMove",
        description: "Durable jogger pants with utility pockets.",
        price: 79,
        image: [bottomm2],
        category: "Men",
        subCategory: "Bottoms",
        sizes: ["S", "M", "L", "XL"],
        date: 1719312745448,
        bestseller: false
    },
    {
        id: "m_bottom_3",
        name: "Loose Fit Parachute Cargo Pants",
        description: "Cargo pants with mutiple utility pockets.",
        price: 89,
        image: [bottomm3],
        category: "Men",
        subCategory: "Bottoms",
        sizes: ["S", "M", "L", "XL"],
        date: 1719399145448,
        bestseller: true
    },
    {
        id: "m_bottom_4",
        name: "Regular Fit Sports Cargo Joggers",
        description: "Cargo Joggers for smart casual look.",
        price: 69,
        image: [bottomm4],
        category: "Men",
        subCategory: "Bottoms",
        sizes: ["S", "M", "L", "XL"],
        date: 1719485545448,
        bestseller: false
    },
    {
        id: "m_bottom_5",
        name: "Slim-Fit Sports Joggers with DryMove",
        description: "Comfortable casual joggers for gym.",
        price: 49,
        image: [bottomm5],
        category: "Men",
        subCategory: "Bottoms",
        sizes: ["S", "M", "L", "XL"],
        date: 1719571945448,
        bestseller: true
    },
    {
        id: "m_bottom_6",
        name: "Mid-Length Sports Shorts with DryMove",
        description: "Lightweight track shorts for workout and leisure.",
        price: 55,
        image: [bottomm6],
        category: "Men",
        subCategory: "Bottoms",
        sizes: ["S", "M", "L", "XL"],
        date: 1719658345448,
        bestseller: false
    },
    {
        id: "m_bottom_7",
        name: "Regular-Fit Cotton Cargo Joggers with DryMove",
        description: "Cotton Cargo Joggers for regular settings.",
        price: 99,
        image: [bottomm7],
        category: "Men",
        subCategory: "Bottoms",
        sizes: ["S", "M", "L", "XL"],
        date: 1719744745448,
        bestseller: true
    },
    {
        id: "m_bottom_8",
        name: "Double-Layered Sports Shorts with DryMove",
        description: "Functional sports shorts with multiple pockets.",
        price: 45,
        image: [bottomm8],
        category: "Men",
        subCategory: "Bottoms",
        sizes: ["S", "M", "L", "XL"],
        date: 1719831145448,
        bestseller: false
    },
    {
        id: "m_bottom_9",
        name: "Short Sports Shorts",
        description: "Soft and comfortable shorts for relaxation.",
        price: 49,
        image: [bottomm9],
        category: "Men",
        subCategory: "Bottoms",
        sizes: ["S", "M", "L", "XL"],
        date: 1719917545448,
        bestseller: true
    },
    {
        id: "m_bottom_10",
        name: "Long 2-in-1 Sports Shorts in DryMove",
        description: "Lightweight shorts for summer comfort.",
        price: 79,
        image: [bottomm10],
        category: "Men",
        subCategory: "Bottoms",
        sizes: ["S", "M", "L", "XL"],
        date: 1720003945448,
        bestseller: false
    },
     // Outfit sets (2 items)

    {
        id: "gym_set_1",
        name: "Women's Gym Outfit Set",
        description: "A complete gym outfit set including a sports bra and leggings for women.",
        price: 120,
        image: [setw1],
        category: "Women",
        subCategory: "Sets",
        sizes: ["S", "M", "L"],
        date: 1720954345448,
        bestseller: true
    },
    {
        id: "gym_set_2",
        name: "Women Gym Outfit Matching Set",
        description: "A complete gym outfit set including a moisture-wicking t-shirt and joggers for women.",
        price: 130,
        image: [setw2],
        category: "Women",
        subCategory: "Sets",
        sizes: ["M", "L", "XL"],
        date: 1721040745448,
        bestseller: false
    },
    {
        id: "gym_set_1",
        name: "Men's Gym Outfit Set",
        description: "A complete gym outfit set including a sports tshirt under jacket.",
        price: 120,
        image: [setm1],
        category: "Men",
        subCategory: "Sets",
        sizes: ["S", "M", "L"],
        date: 1720954345448,
        bestseller: true
    },
    {
        id: "gym_set_2",
        name: "Men Gym Outfit Matching Set",
        description: "A complete gym outfit set including a moisture-wicking t-shirt and cargo joggers for men.",
        price: 130,
        image: [setm2],
        category: "Men",
        subCategory: "Sets",
        sizes: ["M", "L", "XL"],
        date: 1721040745448,
        bestseller: false
    },
    // Gym Equipment (10 items)
    {
        id: "gym_1",
        name: "Yoga Mat",
        description: "It is made from recyclable thermoplastic elastomer, which is strong and long-lasting.",
        price: 249,
        image: [gym1],
        category: "Gym Equipment",
        subCategory: "Weights",
        sizes: ["One Size"],
        date: 1720090345448,
        bestseller: true
    },
    {
        id: "gym_2",
        name: "Water Bottle",
        description: "Plastic water bottle with a printed motif and a sports cap.",
        price: 29,
        image: [gym2],
        category: "Gym Equipment",
        subCategory: "Accessories",
        sizes: ["One Size"],
        date: 1720176745448,
        bestseller: false
    },
    {
        id: "gym_3",
        name: "Tube Resistance Bands with Handles",
        description: " They are lightweight and portable, easy to fit into your gym bag for training on the go.",
        price: 39,
        image: [gym3],
        category: "Gym Equipment",
        subCategory: "Accessories",
        sizes: ["One Size"],
        date: 1720263145448,
        bestseller: true
    },
    {
        id: "gym_4",
        name: "4-pack Wrist Sweatbands",
        description: "Set of four wrist sweatbands in terry. Handy for wiping sweat from your face during gym sessions or tennis.",
        price: 59,
        image: [gym4],
        category: "Gym Equipment",
        subCategory: "Weights",
        sizes: ["8kg", "12kg", "16kg"],
        date: 1720349545448,
        bestseller: false
    },
    {
        id: "gym_5",
        name: "Short Resistance Bands",
        description: "They are sold in pairs, or you can order the full set for maximum versatility.",
        price: 19,
        image: [gym5],
        category: "Gym Equipment",
        subCategory: "Cardio",
        sizes: ["One Size"],
        date: 1720435945448,
        bestseller: true
    },
    {
        id: "gym_6",
        name: "RAPIDSTRIKE Massage Gun",
        description: "It is adjustable and comes with four different massage heads that are easy to switch out, depending on where and what type of massage you want.",
        price: 39,
        image: [gym6],
        category: "Gym Equipment",
        subCategory: "Strength",
        sizes: ["One Size"],
        date: 1720522345448,
        bestseller: false
    },
    {
        id: "gym_7",
        name: "Leather Lifting Belt",
        description: "The belt's specifications comply with USAPL and IPF competition standards.",
        price: 299,
        image: [gym7],
        category: "Gym Equipment",
        subCategory: "Cardio",
        sizes: ["One Size"],
        date: 1720608745448,
        bestseller: true
    },
    {
        id: "gym_8",
        name: "Foam Roller",
        description: "The rollers feature a smooth surface to provide even pressure across their entire length.",
        price: 29,
        image: [gym8],
        category: "Gym Equipment",
        subCategory: "Recovery",
        sizes: ["One Size"],
        date: 1720695145448,
        bestseller: false
    },
    {
        id: "gym_9",
        name: "Circle Hip Bands",
        description: "They help you warm up, strengthen muscles, add resistance to lifts, and improve mobility and recovery.",
        price: 25,
        image: [gym9],
        category: "Gym Equipment",
        subCategory: "Accessories",
        sizes: ["S", "M", "L"],
        date: 1720781545448,
        bestseller: true
    },
    {
        id: "gym_10",
        name: "Ab Support Mat",
        description: "It was designed to follow the contours of your back, so it’s thicker on one side and more sloped on the other. ",
        price: 129,
        image: [gym10],
        category: "Gym Equipment",
        subCategory: "Accessories",
        sizes: ["One Size"],
        date: 1720867945448,
        bestseller: false
    }
];

export default assets;