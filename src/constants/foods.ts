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
];
