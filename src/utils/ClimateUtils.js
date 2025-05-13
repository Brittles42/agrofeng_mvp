/**
 * Utility functions for climate and plant hardiness zone detection
 */

/**
 * Get climate zone from zipcode
 * In a real app, this would call an API, but for MVP we use a simplified mapping
 * @param {string} zipcode - User's zipcode
 * @returns {string} - Climate zone
 */
export const getClimateFromZipcode = (zipcode) => {
  // Very simplified mapping based on first digit of US zipcodes
  const firstDigit = zipcode.charAt(0);
  
  const climateMap = {
    '0': 'Continental',
    '1': 'Continental',
    '2': 'Subtropical',
    '3': 'Subtropical',
    '4': 'Continental',
    '5': 'Continental',
    '6': 'Arid',
    '7': 'Arid',
    '8': 'Temperate',
    '9': 'Temperate'
  };
  
  return climateMap[firstDigit] || 'Unknown';
};

/**
 * Get USDA plant hardiness zone from zipcode
 * @param {string} zipcode - User's zipcode
 * @returns {string} - USDA hardiness zone (e.g., "7b")
 */
export const getHardinessZone = (zipcode) => {
  // Simplified mapping based on first digit of US zipcodes
  // In a real app, this would use a more accurate API or database
  const firstDigit = parseInt(zipcode.charAt(0));
  const secondDigit = parseInt(zipcode.charAt(1));
  
  // Very rough approximation of USDA zones based on zipcode
  // 0-1: Northeast (zones 3-6)
  // 2-3: Southeast (zones 7-10)
  // 4-5: Midwest (zones 4-7)
  // 6-7: Southwest (zones 7-10)
  // 8-9: West (zones 5-10)
  
  let baseZone;
  
  if (firstDigit <= 1) {
    baseZone = 3 + firstDigit + Math.min(secondDigit / 3, 2);
  } else if (firstDigit <= 3) {
    baseZone = 7 + (firstDigit - 2) + Math.min(secondDigit / 3, 2);
  } else if (firstDigit <= 5) {
    baseZone = 4 + (firstDigit - 4) + Math.min(secondDigit / 3, 2);
  } else if (firstDigit <= 7) {
    baseZone = 7 + (firstDigit - 6) + Math.min(secondDigit / 3, 2);
  } else {
    baseZone = 5 + (firstDigit - 8) + Math.min(secondDigit / 3, 2);
  }
  
  // Round to nearest whole number for the main zone
  const mainZone = Math.round(baseZone);
  
  // Determine a or b subzone
  const subZone = baseZone - Math.floor(baseZone) < 0.5 ? 'a' : 'b';
  
  return `${mainZone}${subZone}`;
};

/**
 * Get recommended plants based on zipcode, climate zone and hardiness zone
 * @param {string} zipcode - User's zipcode
 * @param {string} climateZone - Climate zone
 * @param {string} hardinessZone - USDA hardiness zone
 * @returns {Object} - Object containing recommended plants by category
 */
export const getRecommendedPlants = (zipcode, climateZone, hardinessZone) => {
  // First check if we have specific recommendations for this zipcode
  const zipcodeRecommendations = PLANT_DATABASE.zipcodes[zipcode];
  
  if (zipcodeRecommendations) {
    console.log(`Using specific plant recommendations for zipcode ${zipcode}`);
    return zipcodeRecommendations;
  }
  
  // Then check if we have specific recommendations for this hardiness zone
  const hardinessZoneRecommendations = PLANT_DATABASE.hardinessZones[hardinessZone];
  
  // Then get climate-specific recommendations
  const climateRecommendations = PLANT_DATABASE.climateZones[climateZone] || PLANT_DATABASE.climateZones.Default;
  
  // Combine recommendations, prioritizing hardiness zone-specific plants
  return {
    trees: [...new Set([...(hardinessZoneRecommendations?.trees || []), ...climateRecommendations.trees])],
    shrubs: [...new Set([...(hardinessZoneRecommendations?.shrubs || []), ...climateRecommendations.shrubs])],
    perennials: [...new Set([...(hardinessZoneRecommendations?.perennials || []), ...climateRecommendations.perennials])],
    annuals: [...new Set([...(hardinessZoneRecommendations?.annuals || []), ...climateRecommendations.annuals])],
    groundcovers: [...new Set([...(hardinessZoneRecommendations?.groundcovers || []), ...climateRecommendations.groundcovers])],
    edibles: [...new Set([...(hardinessZoneRecommendations?.edibles || []), ...climateRecommendations.edibles])]
  };
};

/**
 * Get feng shui element recommendations based on plant type and climate
 * @param {string} climateZone - Climate zone
 * @returns {Object} - Object containing feng shui element recommendations
 */
export const getFengShuiRecommendations = (climateZone) => {
  return FENG_SHUI_DATABASE[climateZone] || FENG_SHUI_DATABASE.Default;
};

/**
 * Database of plants organized by climate zone and hardiness zone
 */
const PLANT_DATABASE = {
  climateZones: {
    'Tropical': {
      trees: ['Coconut Palm', 'Banana', 'Mango', 'Jackfruit', 'Breadfruit'],
      shrubs: ['Hibiscus', 'Bougainvillea', 'Bird of Paradise', 'Heliconia', 'Plumeria'],
      perennials: ['Anthurium', 'Bromeliad', 'Orchid', 'Ginger', 'Canna Lily'],
      annuals: ['Coleus', 'Impatiens', 'Caladium', 'Begonia', 'Marigold'],
      groundcovers: ['Mondo Grass', 'Beach Sunflower', 'Perennial Peanut', 'Blue Daze', 'Asian Jasmine'],
      edibles: ['Papaya', 'Pineapple', 'Passion Fruit', 'Avocado', 'Turmeric']
    },
    'Subtropical': {
      trees: ['Citrus', 'Olive', 'Fig', 'Peach', 'Loquat'],
      shrubs: ['Gardenia', 'Camellia', 'Azalea', 'Oleander', 'Lantana'],
      perennials: ['Agapanthus', 'Coreopsis', 'Daylily', 'Salvia', 'Verbena'],
      annuals: ['Zinnia', 'Cosmos', 'Sunflower', 'Nasturtium', 'Sweet Alyssum'],
      groundcovers: ['Creeping Thyme', 'Lantana', 'Asiatic Jasmine', 'Liriope', 'Creeping Jenny'],
      edibles: ['Citrus', 'Strawberry', 'Blueberry', 'Tomato', 'Pepper']
    },
    'Temperate': {
      trees: ['Maple', 'Oak', 'Cherry', 'Apple', 'Dogwood'],
      shrubs: ['Hydrangea', 'Rhododendron', 'Viburnum', 'Lilac', 'Forsythia'],
      perennials: ['Hosta', 'Astilbe', 'Echinacea', 'Black-eyed Susan', 'Sedum'],
      annuals: ['Petunia', 'Pansy', 'Snapdragon', 'Marigold', 'Sweet Pea'],
      groundcovers: ['Creeping Phlox', 'Vinca', 'Pachysandra', 'Sweet Woodruff', 'Ajuga'],
      edibles: ['Apple', 'Pear', 'Raspberry', 'Blackberry', 'Kale']
    },
    'Continental': {
      trees: ['Birch', 'Spruce', 'Pine', 'Larch', 'Aspen'],
      shrubs: ['Juniper', 'Potentilla', 'Ninebark', 'Serviceberry', 'Red-twig Dogwood'],
      perennials: ['Yarrow', 'Russian Sage', 'Catmint', 'Daylily', 'Coneflower'],
      annuals: ['Geranium', 'Alyssum', 'Calendula', 'Nasturtium', 'Viola'],
      groundcovers: ['Sedum', 'Creeping Juniper', 'Arctic Willow', 'Bearberry', 'Kinnikinnick'],
      edibles: ['Rhubarb', 'Currant', 'Gooseberry', 'Haskap', 'Hardy Kiwi']
    },
    'Arid': {
      trees: ['Mesquite', 'Palo Verde', 'Desert Willow', 'Joshua Tree', 'Acacia'],
      shrubs: ['Sage', 'Ocotillo', 'Creosote Bush', 'Brittlebush', 'Jojoba'],
      perennials: ['Agave', 'Yucca', 'Aloe', 'Penstemon', 'Desert Marigold'],
      annuals: ['Desert Lupine', 'California Poppy', 'Desert Sunflower', 'Globe Mallow', 'Desert Bluebells'],
      groundcovers: ['Ice Plant', 'Trailing Lantana', 'Blackfoot Daisy', 'Desert Zinnia', 'Trailing Indigo Bush'],
      edibles: ['Prickly Pear', 'Pomegranate', 'Date Palm', 'Fig', 'Jujube']
    },
    'Default': {
      trees: ['Oak', 'Maple', 'Pine', 'Fruit Trees', 'Flowering Dogwood'],
      shrubs: ['Hydrangea', 'Lilac', 'Boxwood', 'Azalea', 'Rhododendron'],
      perennials: ['Lavender', 'Echinacea', 'Black-eyed Susan', 'Daylily', 'Hosta'],
      annuals: ['Marigold', 'Zinnia', 'Petunia', 'Sunflower', 'Cosmos'],
      groundcovers: ['Creeping Thyme', 'Sedum', 'Vinca', 'Pachysandra', 'Ajuga'],
      edibles: ['Tomato', 'Pepper', 'Lettuce', 'Herbs', 'Berries']
    }
  },
  zipcodes: {
    '95460': {
      trees: ['Coast Redwood', 'Douglas Fir', 'California Bay Laurel', 'Madrone', 'Bishop Pine'],
      shrubs: ['Ceanothus', 'Manzanita', 'Salal', 'California Lilac', 'Western Azalea'],
      perennials: ['California Fuchsia', 'Seaside Daisy', 'Yarrow', 'Douglas Iris', 'Coast Buckwheat'],
      annuals: ['California Poppy', 'Baby Blue Eyes', 'Clarkia', 'Lupine', 'Farewell-to-Spring'],
      groundcovers: ['Kinnikinnick', 'Beach Strawberry', 'Yerba Buena', 'Wild Ginger', 'Redwood Sorrel'],
      edibles: ['Huckleberry', 'Thimbleberry', 'Elderberry', 'Miners Lettuce', 'Bay Nuts']
    },
    '90210': {
      trees: ['Coast Live Oak', 'Western Sycamore', 'California Pepper', 'Olive', 'Jacaranda'],
      shrubs: ['Toyon', 'Lemonade Berry', 'Coffeeberry', 'White Sage', 'Cleveland Sage'],
      perennials: ['Matilija Poppy', 'Island Snapdragon', 'Chalk Dudleya', 'Channel Island Tree Poppy', 'Catalina Silverlace'],
      annuals: ['Tidy Tips', 'Globe Gilia', 'California Poppy', 'Desert Bluebells', 'Goldfields'],
      groundcovers: ['Creeping Sage', 'Coyote Mint', 'Deer Grass', 'Canyon Prince Wild Rye', 'Carex'],
      edibles: ['Prickly Pear', 'Lemonade Berry', 'Manzanita Berries', 'Chia', 'California Bay']
    },
    '98101': {
      trees: ['Western Red Cedar', 'Sitka Spruce', 'Vine Maple', 'Pacific Dogwood', 'Shore Pine'],
      shrubs: ['Salal', 'Oregon Grape', 'Red Flowering Currant', 'Evergreen Huckleberry', 'Snowberry'],
      perennials: ['Sword Fern', 'Deer Fern', 'Inside-Out Flower', 'Columbine', 'Western Bleeding Heart'],
      annuals: ['Farewell-to-Spring', 'Sea Blush', 'Miners Lettuce', 'Spring Gold', 'Blue-eyed Mary'],
      groundcovers: ['Kinnikinnick', 'Wild Ginger', 'False Lily of the Valley', 'Bunchberry', 'Twinflower'],
      edibles: ['Salmonberry', 'Thimbleberry', 'Trailing Blackberry', 'Huckleberry', 'Oregon Grape']
    },
    '10001': {
      trees: ['Red Maple', 'American Sweetgum', 'Pin Oak', 'American Hornbeam', 'Serviceberry'],
      shrubs: ['Winterberry Holly', 'Arrowwood Viburnum', 'New Jersey Tea', 'Summersweet', 'Bayberry'],
      perennials: ['New England Aster', 'Butterfly Weed', 'Joe Pye Weed', 'Cardinal Flower', 'Blue Flag Iris'],
      annuals: ['Sunflower', 'Partridge Pea', 'Plains Coreopsis', 'Spotted Beebalm', 'Annual Phlox'],
      groundcovers: ['Wild Ginger', 'Foamflower', 'Wild Strawberry', 'Pennsylvania Sedge', 'Creeping Phlox'],
      edibles: ['Highbush Blueberry', 'Pawpaw', 'American Persimmon', 'Serviceberry', 'Wild Strawberry']
    },
    '78701': {
      trees: ['Texas Live Oak', 'Texas Mountain Laurel', 'Mexican Plum', 'Desert Willow', 'Texas Redbud'],
      shrubs: ['Agarita', 'Cenizo', 'Flame Acanthus', 'Texas Sage', 'Yaupon Holly'],
      perennials: ['Blackfoot Daisy', 'Mealy Blue Sage', 'Greggs Mistflower', 'Rock Penstemon', 'Autumn Sage'],
      annuals: ['Bluebonnet', 'Indian Blanket', 'Pink Evening Primrose', 'Drummond Phlox', 'Texas Paintbrush'],
      groundcovers: ['Frogfruit', 'Horseherb', 'Silver Ponyfoot', 'Snake Herb', 'Woolly Stemodia'],
      edibles: ['Agarita Berry', 'Texas Persimmon', 'Mustang Grape', 'Dewberry', 'Prickly Pear']
    }
  },
  hardinessZones: {
    '3a': {
      trees: ['Paper Birch', 'Siberian Larch', 'Amur Maple', 'Quaking Aspen', 'Jack Pine'],
      shrubs: ['Nanking Cherry', 'Common Lilac', 'Dwarf Arctic Willow', 'Siberian Peashrub', 'Red-osier Dogwood'],
      perennials: ['Siberian Iris', 'Iceland Poppy', 'Hens and Chicks', 'Sea Thrift', 'Pasque Flower'],
      edibles: ['Honeyberry', 'Highbush Cranberry', 'Rhubarb', 'Chives', 'Alpine Strawberry']
    },
    '4b': {
      trees: ['Norway Spruce', 'River Birch', 'Kentucky Coffeetree', 'American Linden', 'Hackberry'],
      shrubs: ['Arrowwood Viburnum', 'Annabelle Hydrangea', 'Ninebark', 'Forsythia', 'Dwarf Bush Honeysuckle'],
      perennials: ['Bleeding Heart', 'Columbine', 'Peony', 'Daylily', 'Coral Bells'],
      edibles: ['Apple', 'Plum', 'Currant', 'Gooseberry', 'Asparagus']
    },
    '6a': {
      trees: ['Red Maple', 'Eastern Redbud', 'Serviceberry', 'Sweetgum', 'River Birch'],
      shrubs: ['Oakleaf Hydrangea', 'Winterberry Holly', 'Beautyberry', 'Summersweet', 'Virginia Sweetspire'],
      perennials: ['Baptisia', 'Coneflower', 'Bee Balm', 'Liatris', 'Autumn Joy Sedum'],
      edibles: ['Peach', 'Cherry', 'Blackberry', 'Raspberry', 'Grapes']
    },
    '8b': {
      trees: ['Crape Myrtle', 'Southern Magnolia', 'Live Oak', 'Bald Cypress', 'Windmill Palm'],
      shrubs: ['Camellia', 'Loropetalum', 'Abelia', 'Gardenia', 'Bottlebrush'],
      perennials: ['Canna', 'Agapanthus', 'Lantana', 'Mexican Petunia', 'Firebush'],
      edibles: ['Fig', 'Persimmon', 'Citrus', 'Blueberry', 'Muscadine Grape']
    },
    '10a': {
      trees: ['Royal Poinciana', 'Gumbo Limbo', 'Coconut Palm', 'Mango', 'Avocado'],
      shrubs: ['Hibiscus', 'Ixora', 'Bougainvillea', 'Croton', 'Plumeria'],
      perennials: ['Bird of Paradise', 'Heliconia', 'Bromeliad', 'Pentas', 'Caladium'],
      edibles: ['Banana', 'Papaya', 'Pineapple', 'Passion Fruit', 'Starfruit']
    }
  }
};

/**
 * Database of feng shui element recommendations by climate zone
 */
const FENG_SHUI_DATABASE = {
  'Tropical': {
    water: {
      description: 'Water elements are naturally abundant in tropical climates',
      placement: 'North and East areas of the garden',
      plants: ['Taro', 'Canna Lily', 'Elephant Ear', 'Water Lily', 'Lotus'],
      features: ['Small pond', 'Water fountain', 'Birdbath', 'Stream']
    },
    wood: {
      description: 'Wood elements thrive in the moisture-rich tropical environment',
      placement: 'East and Southeast areas of the garden',
      plants: ['Bamboo', 'Banana', 'Palms', 'Ficus', 'Rubber Tree'],
      features: ['Wooden benches', 'Trellises', 'Pergolas']
    },
    fire: {
      description: 'Fire elements balance the abundant water energy',
      placement: 'South area of the garden',
      plants: ['Heliconia', 'Red Ginger', 'Hibiscus', 'Anthurium', 'Cordyline'],
      features: ['Outdoor lighting', 'Fire pit (if climate permits)', 'Red garden art']
    },
    earth: {
      description: 'Earth elements provide stability and grounding',
      placement: 'Center, Southwest and Northeast areas of the garden',
      plants: ['Bromeliads', 'Crotons', 'Ti Plant', 'Succulents', 'Orchids'],
      features: ['Stone pathways', 'Rock gardens', 'Terracotta pots']
    },
    metal: {
      description: 'Metal elements help control excessive growth',
      placement: 'West and Northwest areas of the garden',
      plants: ['Silver Buttonwood', 'Dusty Miller', 'Silver Thyme', 'White Flowering Plants'],
      features: ['Wind chimes', 'Metal sculptures', 'Copper or brass accents']
    }
  },
  'Subtropical': {
    water: {
      description: 'Water elements provide cooling energy',
      placement: 'North and East areas of the garden',
      plants: ['Iris', 'Canna', 'Papyrus', 'Taro', 'Ferns'],
      features: ['Reflecting pool', 'Fountain', 'Birdbath']
    },
    wood: {
      description: 'Wood elements represent growth and vitality',
      placement: 'East and Southeast areas of the garden',
      plants: ['Citrus Trees', 'Bamboo', 'Ficus', 'Magnolia', 'Crape Myrtle'],
      features: ['Wooden garden structures', 'Living walls', 'Trellises']
    },
    fire: {
      description: 'Fire elements add warmth and passion',
      placement: 'South area of the garden',
      plants: ['Bougainvillea', 'Lantana', 'Bird of Paradise', 'Red Salvia', 'Bottlebrush'],
      features: ['Outdoor lighting', 'Fire pit', 'BBQ area']
    },
    earth: {
      description: 'Earth elements provide stability',
      placement: 'Center, Southwest and Northeast areas of the garden',
      plants: ['Agave', 'Aloe', 'Yucca', 'Sedum', 'Echeveria'],
      features: ['Stone pathways', 'Gravel gardens', 'Terracotta containers']
    },
    metal: {
      description: 'Metal elements add precision and clarity',
      placement: 'West and Northwest areas of the garden',
      plants: ['Silver Sage', 'Lavender', 'White Roses', 'Dusty Miller', 'Lambs Ear'],
      features: ['Metal sculptures', 'Wind chimes', 'Garden arches']
    }
  },
  'Temperate': {
    water: {
      description: 'Water elements bring serenity and flow',
      placement: 'North and East areas of the garden',
      plants: ['Astilbe', 'Hosta', 'Japanese Iris', 'Ligularia', 'Ferns'],
      features: ['Small pond', 'Stream', 'Fountain', 'Rain garden']
    },
    wood: {
      description: 'Wood elements represent growth and flexibility',
      placement: 'East and Southeast areas of the garden',
      plants: ['Maple Trees', 'Dogwood', 'Redbud', 'Hydrangea', 'Viburnum'],
      features: ['Wooden arbors', 'Trellises', 'Raised beds']
    },
    fire: {
      description: 'Fire elements add warmth and energy',
      placement: 'South area of the garden',
      plants: ['Red Roses', 'Echinacea', 'Monarda', 'Red Dahlias', 'Crocosmia'],
      features: ['Fire pit', 'Outdoor lighting', 'Red garden art']
    },
    earth: {
      description: 'Earth elements provide stability and nourishment',
      placement: 'Center, Southwest and Northeast areas of the garden',
      plants: ['Sedum', 'Ornamental Grasses', 'Heuchera', 'Peonies', 'Daylilies'],
      features: ['Stone pathways', 'Rock gardens', 'Terracotta containers']
    },
    metal: {
      description: 'Metal elements add precision and clarity',
      placement: 'West and Northwest areas of the garden',
      plants: ['White Roses', 'Shasta Daisy', 'Baby\'s Breath', 'Dusty Miller', 'Silver Artemisia'],
      features: ['Metal sculptures', 'Wind chimes', 'Garden arches']
    }
  },
  'Continental': {
    water: {
      description: 'Water elements bring balance to dry continental climates',
      placement: 'North and East areas of the garden',
      plants: ['Blue Oat Grass', 'Russian Sage', 'Catmint', 'Blue Fescue', 'Iris'],
      features: ['Small pond', 'Birdbath', 'Dry creek bed']
    },
    wood: {
      description: 'Wood elements add vitality and growth',
      placement: 'East and Southeast areas of the garden',
      plants: ['Birch', 'Aspen', 'Linden', 'Serviceberry', 'Dogwood'],
      features: ['Wooden raised beds', 'Trellises', 'Arbors']
    },
    fire: {
      description: 'Fire elements add warmth to cold continental climates',
      placement: 'South area of the garden',
      plants: ['Red Twig Dogwood', 'Autumn Joy Sedum', 'Daylily', 'Blanket Flower', 'Yarrow'],
      features: ['Fire pit', 'Outdoor heating', 'Red garden art']
    },
    earth: {
      description: 'Earth elements provide stability',
      placement: 'Center, Southwest and Northeast areas of the garden',
      plants: ['Ornamental Grasses', 'Sedum', 'Hens and Chicks', 'Catmint', 'Lamb\'s Ear'],
      features: ['Stone pathways', 'Rock gardens', 'Gravel mulch']
    },
    metal: {
      description: 'Metal elements add structure in harsh climates',
      placement: 'West and Northwest areas of the garden',
      plants: ['Silver Mound Artemisia', 'Snow-in-Summer', 'White Coneflower', 'Lambs Ear', 'Russian Sage'],
      features: ['Metal sculptures', 'Wind chimes', 'Metal raised beds']
    }
  },
  'Arid': {
    water: {
      description: 'Water elements are precious in arid climates',
      placement: 'North and East areas of the garden',
      plants: ['Blue Agave', 'Blue Sage', 'Desert Willow', 'Blue Palo Verde', 'Blue Euphorbia'],
      features: ['Small pond with cover', 'Rainwater harvesting', 'Dry creek bed']
    },
    wood: {
      description: 'Wood elements represent resilience in harsh conditions',
      placement: 'East and Southeast areas of the garden',
      plants: ['Mesquite', 'Palo Verde', 'Desert Willow', 'Ocotillo', 'Creosote Bush'],
      features: ['Shade structures', 'Ramadas', 'Wooden benches']
    },
    fire: {
      description: 'Fire elements are already abundant in hot arid climates',
      placement: 'South area of the garden',
      plants: ['Red Yucca', 'Firecracker Penstemon', 'Bougainvillea', 'Red Bird of Paradise', 'Ocotillo'],
      features: ['Red rock', 'Copper accents', 'Outdoor lighting']
    },
    earth: {
      description: 'Earth elements are dominant in desert landscapes',
      placement: 'Center, Southwest and Northeast areas of the garden',
      plants: ['Agave', 'Barrel Cactus', 'Golden Barrel', 'Aloe', 'Euphorbia'],
      features: ['Desert rock gardens', 'Gravel mulch', 'Earth-toned pottery']
    },
    metal: {
      description: 'Metal elements add structure and control',
      placement: 'West and Northwest areas of the garden',
      plants: ['White Sage', 'Desert Milkweed', 'White Evening Primrose', 'Brittlebush', 'White Gaura'],
      features: ['Metal sculptures', 'Wind chimes', 'Metal shade structures']
    }
  },
  'Default': {
    water: {
      description: 'Water elements bring serenity and flow',
      placement: 'North and East areas of the garden',
      plants: ['Ferns', 'Hostas', 'Astilbe', 'Japanese Iris', 'Water Lilies'],
      features: ['Small pond', 'Fountain', 'Birdbath', 'Rain garden']
    },
    wood: {
      description: 'Wood elements represent growth and flexibility',
      placement: 'East and Southeast areas of the garden',
      plants: ['Trees', 'Shrubs', 'Tall Perennials', 'Vines', 'Bamboo'],
      features: ['Wooden arbors', 'Trellises', 'Raised beds']
    },
    fire: {
      description: 'Fire elements add warmth and energy',
      placement: 'South area of the garden',
      plants: ['Red Flowers', 'Spiky Plants', 'Plants with Red Berries', 'Red Foliage'],
      features: ['Fire pit', 'Outdoor lighting', 'Red garden art']
    },
    earth: {
      description: 'Earth elements provide stability and nourishment',
      placement: 'Center, Southwest and Northeast areas of the garden',
      plants: ['Low-growing Plants', 'Yellow and Orange Flowers', 'Square-shaped Plants', 'Edibles'],
      features: ['Stone pathways', 'Rock gardens', 'Terracotta containers']
    },
    metal: {
      description: 'Metal elements add precision and clarity',
      placement: 'West and Northwest areas of the garden',
      plants: ['White Flowers', 'Round-leaf Plants', 'Silver or Gray Foliage', 'Aromatic Herbs'],
      features: ['Metal sculptures', 'Wind chimes', 'Garden arches']
    }
  }
};
