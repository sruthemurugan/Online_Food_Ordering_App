const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant'); 
const FoodItem = require('./models/FoodItem');
require('dotenv').config();


const restaurants = [
    {
        name: 'Spice Garden',
        description: 'Authentic Indian cuisine with traditional recipes',
        cuisine: 'Indian',
        deliveryTime: '25-35 mins',
        minimumOrder: 150,
        deliveryFee: 25,
        rating: 4.5,
        imageUrl: 'https://images.unsplash.com/photo-1536305030588-45dc07a2a372?w=700&auto=format&fit=crop'
    },
    {
        name: 'Dragon Palace',
        description: 'Sizzling Chinese dishes with authentic flavors',
        cuisine: 'Chinese',
        deliveryTime: '30-40 mins',
        minimumOrder: 200,
        deliveryFee: 30,
        rating: 4.3,
        imageUrl: 'https://images.unsplash.com/photo-1635685296916-95acaf58471f?w=700&auto=format&fit=crop'
    },
    {
        name: 'Mario\'s Pizza',
        description: 'Italian pizzas and pastas made with love',
        cuisine: 'Italian',
        deliveryTime: '20-30 mins',
        minimumOrder: 250,
        deliveryFee: 20,
        rating: 4.7,
        imageUrl: 'https://plus.unsplash.com/premium_photo-1673823195780-8444a76cfde6?w=700&auto=format&fit=crop'
    },
    {
        name: 'Royal Starters',
        description: 'Specialty starters and appetizers',
        cuisine: 'Indian',
        deliveryTime: '15-25 mins',
        minimumOrder: 100,
        deliveryFee: 15,
        rating: 4.2,
        imageUrl: 'https://plus.unsplash.com/premium_photo-1723928494246-0c38f1bdf204?w=700&auto=format&fit=crop'
    },
    {
        name: 'Sweet Heaven',
        description: 'Desserts, cakes, and ice creams',
        cuisine: 'Desserts',
        deliveryTime: '20-30 mins',
        minimumOrder: 120,
        deliveryFee: 25,
        rating: 4.6,
        imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&auto=format&fit=crop'
    },
    {
        name: 'Café Brew',
        description: 'Coffee, beverages, and light snacks',
        cuisine: 'Beverages',
        deliveryTime: '15-20 mins',
        minimumOrder: 80,
        deliveryFee: 10,
        rating: 4.4,
        imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=700&auto=format&fit=crop'
    },
    {
        name: 'Family Feast',
        description: 'Complete meals and main courses for families',
        cuisine: 'Indian',
        deliveryTime: '30-40 mins',
        minimumOrder: 300,
        deliveryFee: 30,
        rating: 4.5,
        imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop'
    },
    {
        name: 'Sprint Subs',
        description: 'World famous burgers, nuggets, and happy meals',
        cuisine: 'Fast Food',
        deliveryTime: '15-25 mins',
        minimumOrder: 149,
        deliveryFee: 15,
        rating: 4.3,
        imageUrl: 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?w=700&auto=format&fit=crop'
}
];


const foodItemsByRestaurant = {
    'Spice Garden': [
        {
            name: 'Paneer Butter Masala',
            description: 'Cottage cheese cubes in a rich buttery tomato gravy',
            price: 280,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1708793873401-e8c6c153b76a?q=80&w=870&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Chicken Biryani',
            description: 'Fragrant basmati rice cooked with chicken and aromatic spices',
            price: 320,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1708184528306-f75a0a5118ee?w=700&auto=format&fit=crop',
            isVegetarian: false
        },
        {
            name: 'Masala Dosa',
            description: 'Crispy rice crepe filled with spiced potato filling',
            price: 120,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1694849789325-914b71ab4075?w=700&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Butter Naan',
            description: 'Soft leavened bread brushed with butter',
            price: 40,
            category: 'Breads',
            imageUrl: 'https://images.unsplash.com/photo-1690915475862-336b65f571a3?w=700&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Dal Tadka',
            description: 'Lentils tempered with Indian spices',
            price: 140,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1626500154744-e4b394ffea16?w=700&auto=format&fit=crop',
            isVegetarian: true
        }
    ],
    
    'Dragon Palace': [
        {
            name: 'Veg Manchurian',
            description: 'Fried vegetable balls in spicy sauce',
            price: 180,
            category: 'Starters',
            imageUrl: 'https://images.unsplash.com/photo-1682622110433-65513a55d7da?w=700&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Chicken Fried Rice',
            description: 'Stir-fried rice with chicken and vegetables',
            price: 200,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=700&auto=format&fit=crop',
            isVegetarian: false
        },
        {
            name: 'Chilli Chicken',
            description: 'Crispy chicken tossed in spicy chilli sauce',
            price: 280,
            category: 'Main Course',
            imageUrl: 'https://plus.unsplash.com/premium_photo-1675864532625-60efd11cde54?w=700&auto=format&fit=crop',
            isVegetarian: false
        },
        {
            name: 'Hakka Noodles',
            description: 'Stir-fried noodles with vegetables and sauces',
            price: 180,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1617622141573-2e00d8818f3f?w=700&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Spring Rolls',
            description: 'Crispy rolls filled with vegetables',
            price: 160,
            category: 'Starters',
            imageUrl: 'https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?w=700&auto=format&fit=crop',
            isVegetarian: true
        }
    ],
    
    'Mario\'s Pizza': [
        {
            name: 'Margherita Pizza',
            description: 'Classic pizza with tomato sauce and mozzarella cheese',
            price: 250,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=700&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Pasta Alfredo',
            description: 'Pasta in creamy white sauce with parmesan',
            price: 280,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1662197480393-2a82030b7b83?w=700&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Garlic Bread',
            description: 'Toasted bread with garlic butter',
            price: 90,
            category: 'Starters',
            imageUrl: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=700&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Lasagna',
            description: 'Layered pasta with meat sauce and cheese',
            price: 320,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1709429790175-b02bb1b19207?w=700&auto=format&fit=crop',
            isVegetarian: false
        },
        {
            name: 'Spaghetti Carbonara',
            description: 'Pasta with eggs, cheese, pancetta and black pepper',
            price: 290,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?w=700&auto=format&fit=crop',
            isVegetarian: false
        }
    ],
    
    'Royal Starters': [
        {
            name: 'Paneer Tikka',
            description: 'Grilled cottage cheese cubes marinated in spices',
            price: 240,
            category: 'Starters',
            imageUrl: 'https://images.unsplash.com/photo-1666001120694-3ebe8fd207be?w=700&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Chicken Wings',
            description: 'Crispy fried chicken wings with hot sauce',
            price: 280,
            category: 'Starters',
            imageUrl: 'https://plus.unsplash.com/premium_photo-1669742928112-19364a33b530?w=700&auto=format&fit=crop',
            isVegetarian: false
        },
        {
            name: 'French Fries',
            description: 'Crispy golden potato fries with seasoning',
            price: 150,
            category: 'Starters',
            imageUrl: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=700&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Onion Rings',
            description: 'Crispy battered onion rings served with dip',
            price: 180,
            category: 'Starters',
            imageUrl: 'https://images.unsplash.com/photo-1625938146369-adc83368bda7?w=700&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Cheese Balls',
            description: 'Deep-fried cheese balls with crispy coating',
            price: 200,
            category: 'Starters',
            imageUrl: 'https://images.unsplash.com/photo-1751199393301-1fcbd21bd34d?w=700&auto=format&fit=crop',
            isVegetarian: true
        }
    ],
    
    'Sweet Heaven': [
        {
            name: 'Chocolate Brownie',
            description: 'Warm chocolate brownie with vanilla ice cream',
            price: 150,
            category: 'Desserts',
            imageUrl: 'https://images.unsplash.com/photo-1628655387061-f0ca64abd277?w=700&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Gulab Jamun',
            description: 'Deep-fried milk solids in sugar syrup',
            price: 100,
            category: 'Desserts',
            imageUrl: 'https://images.unsplash.com/photo-1695568180070-8b5acead5cf4?w=700&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Ice Cream Sundae',
            description: 'Vanilla ice cream with chocolate sauce and nuts',
            price: 160,
            category: 'Desserts',
            imageUrl: 'https://images.unsplash.com/photo-1657225953401-5f95007fc8e0?w=700&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Cheesecake',
            description: 'Creamy cheesecake with berry compote',
            price: 220,
            category: 'Desserts',
            imageUrl: 'https://images.unsplash.com/photo-1676300185983-d5f242babe34?w=700&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Chocolate Mousse',
            description: 'Light and creamy chocolate dessert',
            price: 190,
            category: 'Desserts',
            imageUrl: 'https://images.unsplash.com/photo-1673551494277-92204546b504?w=700&auto=format&fit=crop',
            isVegetarian: true
        }
    ],
    
    'Café Brew': [
        {
            name: 'Mango Lassi',
            description: 'Refreshing yogurt drink with mango',
            price: 80,
            category: 'Beverages',
            imageUrl: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=700&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Masala Chai',
            description: 'Traditional Indian spiced tea',
            price: 60,
            category: 'Beverages',
            imageUrl: 'https://images.unsplash.com/photo-1636920272028-c27f1ae474c3?w=700&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Cold Coffee',
            description: 'Iced coffee with milk and chocolate syrup',
            price: 140,
            category: 'Beverages',
            imageUrl: 'https://images.unsplash.com/photo-1642647391072-6a2416f048e5?w=700&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Virgin Mojito',
            description: 'Mint lime mocktail with soda',
            price: 120,
            category: 'Beverages',
            imageUrl: 'https://images.unsplash.com/photo-1634496064950-02f043806b09?w=700&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Hot Chocolate',
            description: 'Rich chocolate drink with cream',
            price: 110,
            category: 'Beverages',
            imageUrl: 'https://images.unsplash.com/photo-1637572815755-c4b80092dce1?w=700&auto=format&fit=crop',
            isVegetarian: true
        }
    ],
    
    'Family Feast': [
        {
            name: 'Butter Chicken',
            description: 'Tender chicken pieces in rich buttery tomato gravy',
            price: 350,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=700&auto=format&fit=crop',
            isVegetarian: false
        },
        {
            name: 'Paneer Butter Masala',
            description: 'Cottage cheese cubes in a rich buttery tomato gravy',
            price: 280,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1708793873401-e8c6c153b76a?q=80&w=870&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Dal Tadka',
            description: 'Lentils tempered with Indian spices',
            price: 140,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1626500154744-e4b394ffea16?w=700&auto=format&fit=crop',
            isVegetarian: true
        },
        {
            name: 'Fish Curry',
            description: 'Fish cooked in spicy coconut gravy',
            price: 320,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1654863404432-cac67587e25d?w=700&auto=format&fit=crop',
            isVegetarian: false
        },
        {
            name: 'Chicken Curry',
            description: 'Traditional chicken curry with spices',
            price: 300,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1708782344490-9026aaa5eec7?w=700&auto=format&fit=crop',
            isVegetarian: false
        }
    ],
    'Sprint Subs' : [
        {
            name: 'Crispy Chicken Burger',
            description: 'Crispy fried chicken fillet with mayo and veggies',
            price: 179,
            category: 'Fast Food',
            imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=700&auto=format&fit=crop',
            isVegetarian: false
        },
        {
            name: 'Double Patty Burger',
            description: 'Two beef patties with double cheese and bacon',
            price: 299,
            category: 'Fast Food',
            imageUrl: 'https://plus.unsplash.com/premium_photo-1683619761492-639240d29bb5?w=700&auto=format&fit=crop',
            isVegetarian: false
        },
        {
            name: 'Cheese Nuggets',
            description: 'Deep fried mozzarella cheese sticks',
            price: 139,
            category: 'Fast Food',
            imageUrl: 'https://images.unsplash.com/photo-1582981760753-b52aae38f237?w=700&auto=format&fit=crop',
            isVegetarian: true
        }
    ]
};

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
    console.log('Connected to MongoDB');
    
    await Restaurant.deleteMany({});
    await FoodItem.deleteMany({});
    
    const insertedRestaurants = await Restaurant.insertMany(restaurants);
    console.log(`Added ${insertedRestaurants.length} restaurants`);
    
    const restaurantMap = {};
    insertedRestaurants.forEach(restaurant => {
        restaurantMap[restaurant.name] = restaurant._id;
    });
    
    const allFoodItems = [];
    
    for (const [restaurantName, items] of Object.entries(foodItemsByRestaurant)) {
        const restaurantId = restaurantMap[restaurantName];
        
        if (!restaurantId) {
            console.log(` Restaurant not found: ${restaurantName}`);
            continue;
        }
        
        
        const restaurantFoodItems = items.map(item => ({
            ...item,
            restaurant: restaurantId
        }));
        
        allFoodItems.push(...restaurantFoodItems);
    }
    
    await FoodItem.insertMany(allFoodItems);
    console.log(`Added ${allFoodItems.length} food items`);
    
    // Display summary
    console.log('\nSummary:');
    console.log('='.repeat(40));
    insertedRestaurants.forEach(restaurant => {
        const restaurantItems = allFoodItems.filter(item => 
            item.restaurant.toString() === restaurant._id.toString()
        );
        console.log(`${restaurant.name}: ${restaurantItems.length} items`);
    });
    
    process.exit(0);
})
.catch(err => {
    console.error('Error:', err);
    process.exit(1);
});