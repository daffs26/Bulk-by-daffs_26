export interface DBFood {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
}

export const FOOD_DATABASE: DBFood[] = [
  { id: '1', name: 'Nasi Putih (1 Porsi/100g)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, category: 'Carbohydrates' },
  { id: '2', name: 'Nasi Goreng (1 Porsi)', calories: 350, protein: 9, carbs: 48, fat: 13, category: 'Meals' },
  { id: '3', name: 'Dada Ayam Panggang (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, category: 'Protein' },
  { id: '4', name: 'Ayam Goreng Dada (100g)', calories: 246, protein: 25, carbs: 0, fat: 16, category: 'Protein' },
  { id: '5', name: 'Telur Rebus (1 Butir)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, category: 'Protein' },
  { id: '6', name: 'Telur Goreng/Dadar (1 Butir)', calories: 92, protein: 6.5, carbs: 0.8, fat: 7.0, category: 'Protein' },
  { id: '7', name: 'Tempe Goreng (1 Potong/50g)', calories: 110, protein: 9.5, carbs: 5.5, fat: 7.0, category: 'Protein' },
  { id: '8', name: 'Tahu Goreng (1 Potong/50g)', calories: 58, protein: 4.0, carbs: 1.2, fat: 4.0, category: 'Protein' },
  { id: '9', name: 'Oats (50g kering)', calories: 195, protein: 8.5, carbs: 33, fat: 3.5, category: 'Carbohydrates' },
  { id: '10', name: 'Roti Gandum (1 Lembar)', calories: 80, protein: 4.0, carbs: 15, fat: 1.0, category: 'Carbohydrates' },
  { id: '11', name: 'Roti Putih (1 Lembar)', calories: 95, protein: 3.0, carbs: 18, fat: 1.2, category: 'Carbohydrates' },
  { id: '12', name: 'Pisang Cavendis (1 Buah)', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, category: 'Fruits' },
  { id: '13', name: 'Apel (1 Buah)', calories: 80, protein: 0.4, carbs: 21, fat: 0.2, category: 'Fruits' },
  { id: '14', name: 'Susu Full Cream (200ml)', calories: 122, protein: 6.4, carbs: 9.6, fat: 6.6, category: 'Drinks' },
  { id: '15', name: 'Daging Sapi Panggang (100g)', calories: 250, protein: 26, carbs: 0, fat: 15, category: 'Protein' },
  { id: '16', name: 'Ikan Salmon Panggang (100g)', calories: 208, protein: 20, carbs: 0, fat: 13, category: 'Protein' },
  { id: '17', name: 'Ikan Nila Bakar (100g)', calories: 128, protein: 20, carbs: 0, fat: 4.5, category: 'Protein' },
  { id: '18', name: 'Kentang Rebus (100g)', calories: 87, protein: 1.9, carbs: 20, fat: 0.1, category: 'Carbohydrates' },
  { id: '19', name: 'Alpukat (1 Buah/150g)', calories: 240, protein: 3.0, carbs: 12, fat: 22, category: 'Fruits' },
  { id: '20', name: 'Kacang Almond (30g)', calories: 174, protein: 6.4, carbs: 6.5, fat: 15, category: 'Snacks' },
  { id: '21', name: 'Brokoli Rebus (100g)', calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, category: 'Vegetables' },
  { id: '22', name: 'Bayam Rebus (100g)', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, category: 'Vegetables' },
  { id: '23', name: 'Salad Sayur Mix (1 Porsi)', calories: 45, protein: 1.0, carbs: 8.0, fat: 1.0, category: 'Vegetables' },
  { id: '24', name: 'Kopi Hitam Polos', calories: 2, protein: 0.2, carbs: 0, fat: 0, category: 'Drinks' },
  { id: '25', name: 'Teh Manis (200ml)', calories: 90, protein: 0, carbs: 22, fat: 0, category: 'Drinks' },
  { id: '26', name: 'Mie Instan Kuah (1 Bungkus)', calories: 380, protein: 8, carbs: 53, fat: 15, category: 'Meals' },
  { id: '27', name: 'Bubur Ayam (1 Mangkok)', calories: 290, protein: 12, carbs: 45, fat: 6.5, category: 'Meals' },
  { id: '28', name: 'Bakso Sapi + Kuah (1 Mangkok)', calories: 320, protein: 18, carbs: 28, fat: 14, category: 'Meals' },
  { id: '29', name: 'Sate Ayam (5 Tusuk)', calories: 225, protein: 16, carbs: 8, fat: 12, category: 'Meals' },
  { id: '30', name: 'Rendang Daging Sapi (100g)', calories: 195, protein: 18, carbs: 4, fat: 11, category: 'Meals' },
  { id: '31', name: 'Gado-Gado + Lontong (1 Porsi)', calories: 310, protein: 11, carbs: 42, fat: 12, category: 'Meals' },
  { id: '32', name: 'Soto Ayam + Nasi (1 Porsi)', calories: 350, protein: 16, carbs: 45, fat: 9, category: 'Meals' },
  { id: '33', name: 'Martabak Telur (1 Potong)', calories: 200, protein: 8, carbs: 12, fat: 13, category: 'Snacks' },
  { id: '34', name: 'Martabak Manis Coklat (1 Potong)', calories: 270, protein: 5, carbs: 38, fat: 10, category: 'Snacks' },
  { id: '35', name: 'Pecel Lele + Nasi (1 Porsi)', calories: 420, protein: 24, carbs: 40, fat: 16, category: 'Meals' },
  { id: '36', name: 'Ketoprak (1 Porsi)', calories: 380, protein: 12, carbs: 52, fat: 14, category: 'Meals' },
  { id: '37', name: 'Siomay Bandung (1 Porsi/4 pcs)', calories: 280, protein: 12, carbs: 35, fat: 9, category: 'Snacks' },
  { id: '38', name: 'Batagor (1 Porsi/3 pcs)', calories: 340, protein: 9, carbs: 38, fat: 15, category: 'Snacks' },
  { id: '39', name: 'Pempek Kapal Selam (1 Porsi)', calories: 320, protein: 14, carbs: 45, fat: 8, category: 'Snacks' },
  { id: '40', name: 'Opor Ayam (1 Porsi Dada)', calories: 280, protein: 22, carbs: 4, fat: 18, category: 'Meals' },
  { id: '41', name: 'Rawon Daging Sapi (1 Mangkok)', calories: 220, protein: 18, carbs: 3, fat: 12, category: 'Meals' },
  { id: '42', name: 'Sayur Lodeh (1 Mangkok)', calories: 150, protein: 3.5, carbs: 12, fat: 10, category: 'Vegetables' },
  { id: '43', name: 'Sambal Goreng Kentang (1 Porsi)', calories: 180, protein: 3.5, carbs: 24, fat: 8, category: 'Meals' },
  { id: '44', name: 'Perkedel Kentang (1 pcs)', calories: 85, protein: 1.5, carbs: 12, fat: 3.5, category: 'Snacks' },
  { id: '45', name: 'Capcay Kuah/Goreng (1 Mangkok)', calories: 120, protein: 4.5, carbs: 14, fat: 5, category: 'Vegetables' },
  { id: '46', name: 'Tumis Kangkung (1 Porsi)', calories: 95, protein: 2.8, carbs: 7.2, fat: 6, category: 'Vegetables' },
  { id: '47', name: 'Kerupuk Udang (3 keping)', calories: 105, protein: 1.0, carbs: 15, fat: 5, category: 'Snacks' },
  { id: '48', name: 'Pisang Goreng (1 pcs)', calories: 150, protein: 1.2, carbs: 24, fat: 6.5, category: 'Snacks' },
  { id: '49', name: 'Bakwan Sayur/Bala-Bala (1 pcs)', calories: 137, protein: 1.8, carbs: 16, fat: 7.5, category: 'Snacks' },
  { id: '50', name: 'Klepon (3 pcs)', calories: 120, protein: 1.0, carbs: 24, fat: 2, category: 'Snacks' },
  { id: '51', name: 'Kolak Pisang (1 Mangkok)', calories: 240, protein: 2.5, carbs: 48, fat: 4.5, category: 'Snacks' },
  { id: '52', name: 'Es Cendol Dawet (1 Gelas)', calories: 210, protein: 1.5, carbs: 36, fat: 6.8, category: 'Drinks' },
  
  // ── PROTEIN ADDITIONS ──
  { id: '53', name: 'Ikan Tongkol Balado (100g)', calories: 178, protein: 24, carbs: 2.5, fat: 7.5, category: 'Protein' },
  { id: '54', name: 'Telur Asin (1 Butir)', calories: 137, protein: 9.0, carbs: 1.1, fat: 10.2, category: 'Protein' },
  { id: '55', name: 'Tempe Bacem (1 Potong/50g)', calories: 98, protein: 8.2, carbs: 7.5, fat: 4.2, category: 'Protein' },
  { id: '56', name: 'Tahu Bacem (1 Potong/50g)', calories: 65, protein: 5.0, carbs: 4.2, fat: 3.1, category: 'Protein' },
  { id: '57', name: 'Tuna Kaleng Air / Brine (100g)', calories: 116, protein: 26, carbs: 0, fat: 1.0, category: 'Protein' },
  { id: '58', name: 'Ikan Kembung Goreng (100g)', calories: 198, protein: 22, carbs: 0, fat: 11.5, category: 'Protein' },
  { id: '59', name: 'Whey Protein Shake (1 Scoop/30g)', calories: 120, protein: 24, carbs: 2.0, fat: 1.5, category: 'Protein' },
  { id: '60', name: 'Daging Kambing Bakar (100g)', calories: 220, protein: 25, carbs: 0, fat: 13.0, category: 'Protein' },

  // ── CARBOHYDRATE ADDITIONS ──
  { id: '61', name: 'Nasi Merah (1 Porsi/100g)', calories: 110, protein: 2.3, carbs: 23, fat: 0.8, category: 'Carbohydrates' },
  { id: '62', name: 'Ubi Cilembu Bakar (100g)', calories: 115, protein: 1.6, carbs: 27, fat: 0.2, category: 'Carbohydrates' },
  { id: '63', name: 'Singkong Rebus (100g)', calories: 146, protein: 1.2, carbs: 35, fat: 0.3, category: 'Carbohydrates' },
  { id: '64', name: 'Jagung Rebus (1 Buah/100g)', calories: 96, protein: 3.4, carbs: 21, fat: 1.5, category: 'Carbohydrates' },
  { id: '65', name: 'Pasta Spaghetti Rebus (100g)', calories: 158, protein: 5.8, carbs: 31, fat: 0.9, category: 'Carbohydrates' },
  { id: '66', name: 'Kentang Goreng / French Fries (100g)', calories: 312, protein: 3.4, carbs: 41, fat: 15, category: 'Carbohydrates' },

  // ── MEAL ADDITIONS ──
  { id: '67', name: 'Sate Kambing (5 Tusuk)', calories: 290, protein: 21, carbs: 6, fat: 19, category: 'Meals' },
  { id: '68', name: 'Nasi Uduk Komplit (1 Porsi)', calories: 510, protein: 16, carbs: 64, fat: 21, category: 'Meals' },
  { id: '69', name: 'Nasi Kuning Komplit (1 Porsi)', calories: 490, protein: 15, carbs: 62, fat: 19, category: 'Meals' },
  { id: '70', name: 'Ketupat Sayur (1 Porsi)', calories: 320, protein: 8, carbs: 48, fat: 11, category: 'Meals' },
  { id: '71', name: 'Soto Betawi Daging Sapi (1 Mangkok)', calories: 380, protein: 22, carbs: 12, fat: 28, category: 'Meals' },
  { id: '72', name: 'Nasi Padang + Rendang + Daun Singkong', calories: 680, protein: 26, carbs: 82, fat: 28, category: 'Meals' },
  { id: '73', name: 'Kwetiau Goreng Ayam (1 Porsi)', calories: 420, protein: 14, carbs: 58, fat: 15, category: 'Meals' },
  { id: '74', name: 'Nasi Liwet Sunda (1 Porsi)', calories: 390, protein: 10, carbs: 60, fat: 12, category: 'Meals' },

  // ── VEGETABLE ADDITIONS ──
  { id: '75', name: 'Sayur Asem (1 Mangkok)', calories: 75, protein: 2.1, carbs: 14, fat: 1.2, category: 'Vegetables' },
  { id: '76', name: 'Tumis Toge Tahu (1 Porsi)', calories: 110, protein: 6.2, carbs: 9.5, fat: 5.5, category: 'Vegetables' },
  { id: '77', name: 'Lalapan Daun Singkong Rebus (100g)', calories: 48, protein: 3.7, carbs: 8.8, fat: 0.5, category: 'Vegetables' },
  { id: '78', name: 'Sayur Sop Ayam (1 Mangkok)', calories: 130, protein: 9.5, carbs: 11.2, fat: 4.8, category: 'Vegetables' },
  { id: '79', name: 'Pecel Sayur Madiun (1 Porsi)', calories: 190, protein: 7.2, carbs: 22, fat: 8.5, category: 'Vegetables' },
  { id: '80', name: 'Cah Sawi Hijau Bawang Putih (1 Porsi)', calories: 65, protein: 2.0, carbs: 5.4, fat: 4.0, category: 'Vegetables' },

  // ── FRUIT ADDITIONS ──
  { id: '81', name: 'Pepaya (1 Potong Besar/150g)', calories: 60, protein: 0.8, carbs: 15, fat: 0.1, category: 'Fruits' },
  { id: '82', name: 'Mangga Harum Manis (1 Buah/200g)', calories: 130, protein: 1.6, carbs: 32, fat: 0.4, category: 'Fruits' },
  { id: '83', name: 'Semangka (1 Potong Besar/150g)', calories: 45, protein: 0.9, carbs: 11, fat: 0.2, category: 'Fruits' },
  { id: '84', name: 'Melon (1 Potong/100g)', calories: 36, protein: 0.8, carbs: 9.0, fat: 0.2, category: 'Fruits' },
  { id: '85', name: 'Jeruk Manis (1 Buah)', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, category: 'Fruits' },
  { id: '86', name: 'Buah Naga Merah (100g)', calories: 50, protein: 1.1, carbs: 11, fat: 0.4, category: 'Fruits' },

  // ── SNACK ADDITIONS ──
  { id: '87', name: 'Cilok Bumbu Kacang (5 pcs)', calories: 180, protein: 2.5, carbs: 32, fat: 4.8, category: 'Snacks' },
  { id: '88', name: 'Cireng Goreng (3 pcs)', calories: 195, protein: 1.0, carbs: 35, fat: 5.5, category: 'Snacks' },
  { id: '89', name: 'Jasuke - Jagung Susu Keju (1 Cup)', calories: 230, protein: 5.2, carbs: 34, fat: 8.2, category: 'Snacks' },
  { id: '90', name: 'Roti Bakar Cokelat Keju (1 Potong)', calories: 290, protein: 7.0, carbs: 42, fat: 10.5, category: 'Snacks' },
  { id: '91', name: 'Donat Kentang Tabur Gula (1 pcs)', calories: 210, protein: 3.5, carbs: 28, fat: 9.5, category: 'Snacks' },
  { id: '92', name: 'Kue Cubit Setengah Matang (3 pcs)', calories: 160, protein: 3.0, carbs: 24, fat: 5.8, category: 'Snacks' },

  // ── DRINK ADDITIONS ──
  { id: '93', name: 'Air Kelapa Muda Murni (250ml)', calories: 45, protein: 0.5, carbs: 10.4, fat: 0.1, category: 'Drinks' },
  { id: '94', name: 'Jus Alpukat + Kental Manis (1 Gelas)', calories: 280, protein: 3.2, carbs: 36, fat: 15.4, category: 'Drinks' },
  { id: '95', name: 'Jus Mangga (1 Gelas)', calories: 160, protein: 1.2, carbs: 38, fat: 0.6, category: 'Drinks' },
  { id: '96', name: 'Kopi Susu Gula Aren (1 Gelas)', calories: 180, protein: 4.5, carbs: 24, fat: 7.2, category: 'Drinks' },
  { id: '97', name: 'Teh Tarik (200ml)', calories: 140, protein: 3.2, carbs: 22, fat: 4.5, category: 'Drinks' },
  { id: '98', name: 'Susu Kedelai Manis (200ml)', calories: 95, protein: 6.0, carbs: 10.5, fat: 3.2, category: 'Drinks' },
  
  // ── MORE MEAL VARIANTS ──
  { id: '99', name: 'Nasi Goreng Gila (1 Porsi)', calories: 450, protein: 14, carbs: 54, fat: 19, category: 'Meals' },
  { id: '100', name: 'Mie Goreng Aceh (1 Porsi)', calories: 410, protein: 12, carbs: 56, fat: 15, category: 'Meals' },
  { id: '101', name: 'Seblak Ceker Komplit (1 Porsi)', calories: 380, protein: 10, carbs: 48, fat: 16, category: 'Meals' },
  { id: '102', name: 'Burger Sapi Keju / Cheeseburger', calories: 450, protein: 22, carbs: 38, fat: 22, category: 'Meals' },
  { id: '103', name: 'Pizza Pepperoni (1 Slice)', calories: 290, protein: 12, carbs: 28, fat: 12, category: 'Meals' },
  { id: '104', name: 'Kebab Daging Sapi (1 pcs)', calories: 350, protein: 16, carbs: 34, fat: 15, category: 'Meals' },
  { id: '105', name: 'Ayam Geprek + Nasi (1 Porsi)', calories: 540, protein: 28, carbs: 62, fat: 20, category: 'Meals' },

  // ── MORE PROTEIN VARIANTS ──
  { id: '106', name: 'Ikan Lele Goreng (1 Ekor/100g)', calories: 200, protein: 18, carbs: 0, fat: 14, category: 'Protein' },
  { id: '107', name: 'Daging Bebek Goreng (100g)', calories: 330, protein: 19, carbs: 0, fat: 28, category: 'Protein' },
  { id: '108', name: 'Cumi Cah Saus Padang (100g)', calories: 185, protein: 16, carbs: 6.0, fat: 10.5, category: 'Protein' },
  { id: '109', name: 'Udang Goreng Tepung (100g)', calories: 220, protein: 15, carbs: 12, fat: 12.5, category: 'Protein' },
  { id: '110', name: 'Putih Telur Rebus (100g)', calories: 52, protein: 11, carbs: 0.7, fat: 0.2, category: 'Protein' },
  { id: '111', name: 'Sate Daging Sapi (5 Tusuk)', calories: 240, protein: 22, carbs: 4.0, fat: 14.5, category: 'Protein' },
  { id: '112', name: 'Ikan Kakap Bakar (100g)', calories: 140, protein: 20, carbs: 0, fat: 6.0, category: 'Protein' },

  // ── MORE CARBOHYDRATE VARIANTS ──
  { id: '113', name: 'Jagung Manis Pipil (100g)', calories: 86, protein: 3.2, carbs: 19, fat: 1.2, category: 'Carbohydrates' },
  { id: '114', name: 'Kentang Tumbuk / Mashed Potato (100g)', calories: 110, protein: 2.0, carbs: 17, fat: 4.2, category: 'Carbohydrates' },
  { id: '115', name: 'Roti Canai Polos (1 Lembar)', calories: 280, protein: 5.0, carbs: 46, fat: 8.5, category: 'Carbohydrates' },
  { id: '116', name: 'Ubi Ungu Kukus (100g)', calories: 120, protein: 1.5, carbs: 28, fat: 0.2, category: 'Carbohydrates' },

  // ── MORE VEGETABLE VARIANTS ──
  { id: '117', name: 'Plecing Kangkung (1 Porsi)', calories: 80, protein: 2.5, carbs: 8.0, fat: 4.5, category: 'Vegetables' },
  { id: '118', name: 'Tumis Kacang Panjang Tempe', calories: 115, protein: 5.5, carbs: 10.5, fat: 6.0, category: 'Vegetables' },
  { id: '119', name: 'Urap Sayur Bumbu Kelapa', calories: 140, protein: 3.5, carbs: 16, fat: 7.5, category: 'Vegetables' },
  { id: '120', name: 'Lalapan Segar Mix (Timun, Kemangi)', calories: 20, protein: 0.6, carbs: 4.2, fat: 0.1, category: 'Vegetables' },

  // ── MORE FRUIT VARIANTS ──
  { id: '121', name: 'Jeruk Bali (100g)', calories: 38, protein: 0.8, carbs: 9.6, fat: 0.0, category: 'Fruits' },
  { id: '122', name: 'Nanas Madu (100g)', calories: 50, protein: 0.5, carbs: 13, fat: 0.1, category: 'Fruits' },
  { id: '123', name: 'Salak Pondoh (2 Buah)', calories: 75, protein: 0.6, carbs: 18, fat: 0.3, category: 'Fruits' },

  // ── MORE SNACK VARIANTS ──
  { id: '124', name: 'Tahu Bulat Kopong (3 pcs)', calories: 120, protein: 3.0, carbs: 8.0, fat: 8.5, category: 'Snacks' },
  { id: '125', name: 'Cimol Bumbu Bubuk (1 Porsi)', calories: 210, protein: 1.2, carbs: 38, fat: 5.8, category: 'Snacks' },
  { id: '126', name: 'Risol Mayo Beef (1 pcs)', calories: 220, protein: 4.5, carbs: 22, fat: 12, category: 'Snacks' },
  { id: '127', name: 'Pastel Daging Sayur (1 pcs)', calories: 180, protein: 3.8, carbs: 24, fat: 7.5, category: 'Snacks' },
  { id: '128', name: 'Lumpia Semarang Goreng (1 pcs)', calories: 210, protein: 5.2, carbs: 28, fat: 8.5, category: 'Snacks' },
  { id: '129', name: 'Onde-Onde Wijen (1 pcs)', calories: 150, protein: 2.8, carbs: 24, fat: 4.8, category: 'Snacks' },

  // ── MORE DRINK VARIANTS ──
  { id: '130', name: 'Jus Jeruk Murni (200ml)', calories: 90, protein: 1.4, carbs: 21, fat: 0.2, category: 'Drinks' },
  { id: '131', name: 'Jus Melon (200ml)', calories: 80, protein: 0.8, carbs: 19, fat: 0.1, category: 'Drinks' },
  { id: '132', name: 'Yogurt Plain (100g)', calories: 60, protein: 3.5, carbs: 4.7, fat: 3.3, category: 'Drinks' },
  { id: '133', name: 'Susu Almond Unsweetened (200ml)', calories: 30, protein: 1.0, carbs: 1.5, fat: 2.5, category: 'Drinks' },
  { id: '134', name: 'Es Kelapa Muda Gula Merah', calories: 160, protein: 0.8, carbs: 32, fat: 3.5, category: 'Drinks' },

  // ── INDONESIAN TRADITIONAL & STREET FOOD ADDITIONS ──
  { id: '135', name: 'Mie Ayam Pangsit Bakso (1 Porsi)', calories: 480, protein: 18, carbs: 58, fat: 18, category: 'Meals' },
  { id: '136', name: 'Sate Padang Daging Sapi (5 Tusuk)', calories: 260, protein: 19, carbs: 12, fat: 14, category: 'Meals' },
  { id: '137', name: 'Pecel Ayam + Nasi Uduk (1 Porsi)', calories: 590, protein: 26, carbs: 64, fat: 22, category: 'Meals' },
  { id: '138', name: 'Bubur Manado / Tinutuan (1 Mangkok)', calories: 180, protein: 4.2, carbs: 36, fat: 1.5, category: 'Meals' },
  { id: '139', name: 'Lontong Sayur Labu Siam (1 Porsi)', calories: 290, protein: 6.8, carbs: 44, fat: 10.5, category: 'Meals' },
  { id: '140', name: 'Gudeg Nangka Khas Jogja (100g)', calories: 150, protein: 2.8, carbs: 24, fat: 5.5, category: 'Meals' },
  { id: '141', name: 'Ketupat Tahu Magelang (1 Porsi)', calories: 340, protein: 11, carbs: 46, fat: 12.5, category: 'Meals' },
  { id: '142', name: 'Sup Kambing Kuah Bening (1 Mangkok)', calories: 260, protein: 22, carbs: 4.8, fat: 16.5, category: 'Meals' },
  { id: '143', name: 'Dendeng Sapi Balado (100g)', calories: 320, protein: 28, carbs: 3.5, fat: 21, category: 'Meals' },
  { id: '144', name: 'Ikan Gurame Bakar Kecap (100g)', calories: 180, protein: 19, carbs: 6.0, fat: 8.5, category: 'Meals' },
  { id: '145', name: 'Udang Cah Saus Tiram (100g)', calories: 145, protein: 18, carbs: 4.2, fat: 6.2, category: 'Meals' },
  { id: '146', name: 'Telur Dadar Padang Tebal (1 Potong)', calories: 180, protein: 11, carbs: 3.2, fat: 14, category: 'Protein' },
  { id: '147', name: 'Tempe Orek Basah/Manis (100g)', calories: 195, protein: 12, carbs: 18, fat: 9.5, category: 'Protein' },
  { id: '148', name: 'Tahu Gejrot Cirebon (1 Porsi)', calories: 120, protein: 4.0, carbs: 16, fat: 4.5, category: 'Snacks' },
  { id: '149', name: 'Tempe Mendoan Hangat (1 Potong)', calories: 135, protein: 4.2, carbs: 12, fat: 7.8, category: 'Snacks' },
  { id: '150', name: 'Tahu Sumedang Goreng (3 pcs)', calories: 95, protein: 6.0, carbs: 2.5, fat: 6.8, category: 'Snacks' },
  { id: '151', name: 'Cireng Bumbu Rujak Pedas (3 pcs)', calories: 210, protein: 1.2, carbs: 38, fat: 6.2, category: 'Snacks' },
  { id: '152', name: 'Pisang Bakar Keju Cokelat (1 Buah)', calories: 220, protein: 3.5, carbs: 44, fat: 5.5, category: 'Snacks' },
  { id: '153', name: 'Risol Sayur Bihun Kampung (1 pcs)', calories: 130, protein: 2.2, carbs: 18, fat: 5.5, category: 'Snacks' },
  { id: '154', name: 'Es Teler Komplit Nangka (1 Mangkok)', calories: 280, protein: 2.5, carbs: 54, fat: 7.2, category: 'Drinks' },
  { id: '155', name: 'Es Campur Cincau Selasih (1 Gelas)', calories: 220, protein: 1.8, carbs: 42, fat: 5.2, category: 'Drinks' },
  { id: '156', name: 'Susu Sapi Low Fat (200ml)', calories: 90, protein: 6.6, carbs: 9.8, fat: 2.6, category: 'Drinks' },
  { id: '157', name: 'Kopi Hitam Espresso Murni (1 Shot)', calories: 1, protein: 0.1, carbs: 0, fat: 0, category: 'Drinks' },
  { id: '158', name: 'Matcha Latte Green Tea (1 Gelas)', calories: 150, protein: 4.0, carbs: 22, fat: 4.8, category: 'Drinks' },
  { id: '159', name: 'Greek Yogurt Plain (100g)', calories: 97, protein: 9.0, carbs: 4.0, fat: 5.0, category: 'Drinks' },
  { id: '160', name: 'Es Doger Kelapa Muda (1 Gelas)', calories: 240, protein: 2.0, carbs: 44, fat: 6.5, category: 'Drinks' }
];
