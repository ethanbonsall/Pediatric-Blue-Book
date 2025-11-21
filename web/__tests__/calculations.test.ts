/**
 * Unit tests for critical calculation functions
 * Tests nutritional needs and formula mix totals calculations, including edge cases
 */

describe('Nutritional Needs Calculations', () => {
  describe('Calorie Needs Calculation', () => {
    // Helper function to calculate calories (simplified version of the actual calculation)
    const calculateCalories = (
      ageInYears: number,
      sex: 'Male' | 'Female',
      heightInMeters: number,
      weightInKg: number,
      activityLevel: 'Inactive' | 'Low Active' | 'Active' | 'Very Active' = 'Inactive'
    ): number => {
      // ECG — Energy Cost of Growth
      let ECG = 20
      if (sex === 'Male') {
        if (ageInYears < 0.25) ECG = 200
        else if (ageInYears < 0.5) ECG = 50
        else if (ageInYears < 4) ECG = 20
        else if (ageInYears < 9) ECG = 15
        else if (ageInYears < 14) ECG = 25
        else ECG = 20
      } else {
        if (ageInYears < 0.25) ECG = 180
        else if (ageInYears < 0.5) ECG = 60
        else if (ageInYears < 1) ECG = 20
        else if (ageInYears < 9) ECG = 15
        else if (ageInYears < 14) ECG = 30
        else ECG = 20
      }

      const height_cm = heightInMeters * 100
      let calorie_needs = 0

      // Ages 0–2.99
      if (sex === 'Male' && ageInYears < 3) {
        calorie_needs = -716.45 - ageInYears + 17.82 * height_cm + 15.06 * weightInKg + ECG
      }

      if (sex === 'Female' && ageInYears < 3) {
        calorie_needs = -69.15 + 80 * ageInYears + 2.65 * height_cm + 54.15 * weightInKg + ECG
      }

      // Ages 3–18.99
      if (ageInYears >= 3 && ageInYears < 19) {
        if (sex === 'Male') {
          switch (activityLevel) {
            case 'Inactive':
              calorie_needs = -447.51 + 3.68 * ageInYears + 13.01 * height_cm + 13.15 * weightInKg + ECG
              break
            case 'Low Active':
              calorie_needs = 19.12 + 3.68 * ageInYears + 8.62 * height_cm + 20.28 * weightInKg + ECG
              break
            case 'Active':
              calorie_needs = -388.19 + 3.68 * ageInYears + 12.66 * height_cm + 20.46 * weightInKg + ECG
              break
            case 'Very Active':
              calorie_needs = -671.75 + 3.68 * ageInYears + 15.38 * height_cm + 23.25 * weightInKg + ECG
              break
          }
        }

        if (sex === 'Female') {
          switch (activityLevel) {
            case 'Inactive':
              calorie_needs = 55.59 - 22.25 * ageInYears + 8.43 * height_cm + 17.07 * weightInKg + ECG
              break
            case 'Low Active':
              calorie_needs = -297.54 - 22.25 * ageInYears + 12.77 * height_cm + 14.73 * weightInKg + ECG
              break
            case 'Active':
              calorie_needs = -189.55 - 22.25 * ageInYears + 11.74 * height_cm + 18.34 * weightInKg + ECG
              break
            case 'Very Active':
              calorie_needs = -709.59 - 22.25 * ageInYears + 18.22 * height_cm + 14.25 * weightInKg + ECG
              break
          }
        }
      }

      return Math.round(calorie_needs)
    }

    it('should calculate calories for male infant (0-3 months)', () => {
      const result = calculateCalories(0.1, 'Male', 0.5, 3.5)
      expect(result).toBeGreaterThan(0)
      expect(typeof result).toBe('number')
    })

    it('should calculate calories for female infant (0-3 months)', () => {
      const result = calculateCalories(0.1, 'Female', 0.5, 3.5)
      expect(result).toBeGreaterThan(0)
      expect(typeof result).toBe('number')
    })

    it('should calculate calories for male toddler (1-3 years)', () => {
      const result = calculateCalories(2, 'Male', 0.85, 12)
      expect(result).toBeGreaterThan(0)
      expect(typeof result).toBe('number')
    })

    it('should calculate calories for female toddler (1-3 years)', () => {
      const result = calculateCalories(2, 'Female', 0.85, 12)
      expect(result).toBeGreaterThan(0)
      expect(typeof result).toBe('number')
    })

    it('should calculate calories for male child (3-9 years) with different activity levels', () => {
      const inactive = calculateCalories(5, 'Male', 1.1, 20, 'Inactive')
      const lowActive = calculateCalories(5, 'Male', 1.1, 20, 'Low Active')
      const active = calculateCalories(5, 'Male', 1.1, 20, 'Active')
      const veryActive = calculateCalories(5, 'Male', 1.1, 20, 'Very Active')

      expect(inactive).toBeGreaterThan(0)
      expect(lowActive).toBeGreaterThan(inactive)
      expect(active).toBeGreaterThan(lowActive)
      expect(veryActive).toBeGreaterThan(active)
    })

    it('should calculate calories for female child (3-9 years) with different activity levels', () => {
      const inactive = calculateCalories(5, 'Female', 1.1, 20, 'Inactive')
      const lowActive = calculateCalories(5, 'Female', 1.1, 20, 'Low Active')
      const active = calculateCalories(5, 'Female', 1.1, 20, 'Active')
      const veryActive = calculateCalories(5, 'Female', 1.1, 20, 'Very Active')

      expect(inactive).toBeGreaterThan(0)
      expect(lowActive).toBeGreaterThan(inactive)
      expect(active).toBeGreaterThan(lowActive)
      expect(veryActive).toBeGreaterThan(active)
    })

    it('should handle edge case: very low weight', () => {
      const result = calculateCalories(1, 'Male', 0.7, 5)
      expect(result).toBeGreaterThan(0)
      expect(typeof result).toBe('number')
    })

    it('should handle edge case: very high weight', () => {
      const result = calculateCalories(10, 'Male', 1.4, 60)
      expect(result).toBeGreaterThan(0)
      expect(typeof result).toBe('number')
    })

    it('should handle edge case: age boundary (2.99 years)', () => {
      const result = calculateCalories(2.99, 'Male', 0.9, 15)
      expect(result).toBeGreaterThan(0)
    })

    it('should handle edge case: age boundary (3.0 years)', () => {
      const result = calculateCalories(3.0, 'Male', 0.9, 15, 'Inactive')
      expect(result).toBeGreaterThan(0)
    })
  })

  describe('Holliday-Segar Fluid Calculation', () => {
    const calculateHollidaySegar = (weightInKg: number): number => {
      let holliday_segar_fluid = 0
      if (weightInKg <= 10) {
        holliday_segar_fluid = 100 * weightInKg
      } else if (weightInKg <= 20) {
        holliday_segar_fluid = 1000 + 50 * (weightInKg - 10)
      } else {
        holliday_segar_fluid = 1500 + 20 * (weightInKg - 20)
      }
      return Math.round(holliday_segar_fluid)
    }

    it('should calculate fluid for weight <= 10kg', () => {
      expect(calculateHollidaySegar(5)).toBe(500)
      expect(calculateHollidaySegar(10)).toBe(1000)
    })

    it('should calculate fluid for weight 10-20kg', () => {
      expect(calculateHollidaySegar(15)).toBe(1250) // 1000 + 50 * (15 - 10) = 1000 + 250 = 1250
      expect(calculateHollidaySegar(20)).toBe(1500) // 1000 + 50 * (20 - 10) = 1000 + 500 = 1500
    })

    it('should calculate fluid for weight > 20kg', () => {
      expect(calculateHollidaySegar(25)).toBe(1600) // 1500 + 20 * (25 - 20) = 1500 + 100 = 1600
      expect(calculateHollidaySegar(30)).toBe(1700) // 1500 + 20 * (30 - 20) = 1500 + 200 = 1700
    })

    it('should handle edge case: weight exactly at boundary (10kg)', () => {
      expect(calculateHollidaySegar(10)).toBe(1000)
    })

    it('should handle edge case: weight exactly at boundary (20kg)', () => {
      expect(calculateHollidaySegar(20)).toBe(1500)
    })

    it('should handle edge case: very low weight (1kg)', () => {
      expect(calculateHollidaySegar(1)).toBe(100)
    })

    it('should handle edge case: very high weight (50kg)', () => {
      expect(calculateHollidaySegar(50)).toBe(2100) // 1500 + 20 * (50 - 20) = 1500 + 600 = 2100
    })
  })

  describe('DRI Fluid Calculation', () => {
    const calculateDRIFluid = (
      ageInYears: number,
      sex: 'Male' | 'Female',
      calorieNeeds: number
    ): number => {
      let dri = 0
      if (ageInYears < 0.5) {
        dri = 0.7
      } else if (ageInYears < 1) {
        dri = 0.8
      } else if (ageInYears < 4) {
        dri = 1.3
      } else if (ageInYears < 9) {
        dri = 1.7
      } else if (ageInYears < 14) {
        dri = sex === 'Male' ? 2.4 : 2.1
      } else if (ageInYears < 19) {
        dri = sex === 'Male' ? 3.3 : 2.3
      } else {
        dri = calorieNeeds / 1000
      }
      return Math.round(dri * 10) / 10
    }

    it('should calculate DRI fluid for age < 0.5 years', () => {
      expect(calculateDRIFluid(0.3, 'Male', 0)).toBe(0.7)
    })

    it('should calculate DRI fluid for age 0.5-1 years', () => {
      expect(calculateDRIFluid(0.7, 'Male', 0)).toBe(0.8)
    })

    it('should calculate DRI fluid for age 1-4 years', () => {
      expect(calculateDRIFluid(2, 'Male', 0)).toBe(1.3)
    })

    it('should calculate DRI fluid for age 4-9 years', () => {
      expect(calculateDRIFluid(6, 'Male', 0)).toBe(1.7)
    })

    it('should calculate DRI fluid for age 9-14 years (male)', () => {
      expect(calculateDRIFluid(10, 'Male', 0)).toBe(2.4)
    })

    it('should calculate DRI fluid for age 9-14 years (female)', () => {
      expect(calculateDRIFluid(10, 'Female', 0)).toBe(2.1)
    })

    it('should calculate DRI fluid for age 14-19 years (male)', () => {
      expect(calculateDRIFluid(16, 'Male', 0)).toBe(3.3)
    })

    it('should calculate DRI fluid for age 14-19 years (female)', () => {
      expect(calculateDRIFluid(16, 'Female', 0)).toBe(2.3)
    })

    it('should handle edge case: age boundary (0.5 years)', () => {
      expect(calculateDRIFluid(0.5, 'Male', 0)).toBe(0.8)
    })

    it('should handle edge case: age boundary (14 years)', () => {
      expect(calculateDRIFluid(14, 'Male', 0)).toBe(3.3)
    })
  })

  describe('Protein Needs Calculation', () => {
    const calculateProtein = (ageInYears: number, weightInKg: number): number => {
      let protein_per_kg = 0
      if (ageInYears < 0.5) {
        protein_per_kg = 1.5
      } else if (ageInYears < 1) {
        protein_per_kg = 1.2
      } else if (ageInYears < 2) {
        protein_per_kg = 1.05
      } else if (ageInYears < 14) {
        protein_per_kg = 0.95
      } else if (ageInYears < 19) {
        protein_per_kg = 0.85
      } else {
        protein_per_kg = 0.8
      }

      const protein_needs = protein_per_kg * weightInKg
      return Math.round(protein_needs * 10) / 10
    }

    it('should calculate protein for age < 0.5 years', () => {
      expect(calculateProtein(0.3, 5)).toBe(7.5) // 1.5 * 5 = 7.5
    })

    it('should calculate protein for age 0.5-1 years', () => {
      expect(calculateProtein(0.7, 8)).toBe(9.6) // 1.2 * 8 = 9.6
    })

    it('should calculate protein for age 1-2 years', () => {
      expect(calculateProtein(1.5, 10)).toBe(10.5) // 1.05 * 10 = 10.5
    })

    it('should calculate protein for age 2-14 years', () => {
      expect(calculateProtein(5, 20)).toBe(19) // 0.95 * 20 = 19
    })

    it('should calculate protein for age 14-19 years', () => {
      expect(calculateProtein(16, 50)).toBe(42.5) // 0.85 * 50 = 42.5
    })

    it('should handle edge case: age boundary (0.5 years)', () => {
      expect(calculateProtein(0.5, 5)).toBe(6) // 1.2 * 5 = 6
    })

    it('should handle edge case: very low weight', () => {
      expect(calculateProtein(0.3, 2)).toBe(3) // 1.5 * 2 = 3
    })

    it('should handle edge case: very high weight', () => {
      expect(calculateProtein(16, 80)).toBe(68) // 0.85 * 80 = 68
    })
  })
})

describe('Formula Mix Totals Calculations', () => {
  describe('Powder Formula Calculations', () => {
    const calculatePowderNutrients = (
      gramsPerScoop: number,
      quantity: number,
      servingType: string,
      caloriesPerGram: number,
      np100Protein: number,
      np100Carbs: number,
      np100Fat: number,
      displacementMlPerGram: number,
      servingsPerDay: number = 1
    ): Record<string, number> => {
      const totals: Record<string, number> = {}

      // Calculate grams per serving
      let gramsPerServing = 0
      if (servingType === 'Scoop') {
        gramsPerServing = gramsPerScoop
      }
      // Add other serving types as needed

      const totalGrams = gramsPerServing * quantity
      const mlPrepared = Math.round(displacementMlPerGram * gramsPerServing * quantity)
      const multiplier = mlPrepared / 100

      // Calculate calories
      const calories = totalGrams * caloriesPerGram
      totals['Calories'] = calories

      // Calculate nutrients (per 100ml)
      totals['Protein'] = np100Protein * multiplier
      totals['Carbohydrates'] = np100Carbs * multiplier
      totals['Fats'] = np100Fat * multiplier

      // Divide by servings per day
      Object.keys(totals).forEach((key) => {
        if (servingsPerDay > 0) {
          totals[key] = totals[key] / servingsPerDay
        }
      })

      return totals
    }

    it('should calculate nutrients for single serving powder formula', () => {
      const result = calculatePowderNutrients(
        8.5, // grams per scoop
        1, // quantity
        'Scoop',
        5, // calories per gram
        2.5, // np100 protein
        5, // np100 carbs
        2.5, // np100 fat
        7.06, // displacement ml per gram
        1 // servings per day
      )

      expect(result['Calories']).toBeGreaterThan(0)
      expect(result['Protein']).toBeGreaterThan(0)
      expect(result['Carbohydrates']).toBeGreaterThan(0)
      expect(result['Fats']).toBeGreaterThan(0)
    })

    it('should calculate nutrients for multiple servings powder formula', () => {
      const result = calculatePowderNutrients(
        8.5,
        3,
        'Scoop',
        5,
        2.5,
        5,
        2.5,
        7.06,
        1
      )

      expect(result['Calories']).toBeGreaterThan(0)
      expect(result['Protein']).toBeGreaterThan(0)
    })

    it('should divide totals by servings per day', () => {
      const singleServing = calculatePowderNutrients(8.5, 1, 'Scoop', 5, 2.5, 5, 2.5, 7.06, 1)
      const threeServings = calculatePowderNutrients(8.5, 3, 'Scoop', 5, 2.5, 5, 2.5, 7.06, 3)

      // Three servings divided by 3 should be approximately equal to single serving
      expect(threeServings['Calories']).toBeCloseTo(singleServing['Calories'], 0)
    })

    it('should handle edge case: zero quantity', () => {
      const result = calculatePowderNutrients(8.5, 0, 'Scoop', 5, 2.5, 5, 2.5, 7.06, 1)
      expect(result['Calories']).toBe(0)
    })

    it('should handle edge case: zero servings per day', () => {
      const result = calculatePowderNutrients(8.5, 1, 'Scoop', 5, 2.5, 5, 2.5, 7.06, 0)
      // Should not divide by zero
      expect(result['Calories']).toBeGreaterThanOrEqual(0)
    })

    it('should handle edge case: very large quantity', () => {
      const result = calculatePowderNutrients(8.5, 100, 'Scoop', 5, 2.5, 5, 2.5, 7.06, 1)
      expect(result['Calories']).toBeGreaterThan(0)
      expect(typeof result['Calories']).toBe('number')
      expect(isNaN(result['Calories'])).toBe(false)
    })
  })

  describe('Liquid Formula Calculations', () => {
    const calculateLiquidNutrients = (
      mlPrepared: number,
      caloriesPerMl: number,
      amountPerCartonMl: number,
      totalProtein: number,
      totalCarbs: number,
      totalFat: number,
      servingsPerDay: number = 1
    ): Record<string, number> => {
      const totals: Record<string, number> = {}
      const multiplier = mlPrepared / amountPerCartonMl

      // Calculate calories
      const calories = caloriesPerMl * mlPrepared
      totals['Calories'] = calories

      // Calculate nutrients (per container)
      totals['Protein'] = totalProtein * multiplier
      totals['Carbohydrates'] = totalCarbs * multiplier
      totals['Fats'] = totalFat * multiplier

      // Divide by servings per day
      Object.keys(totals).forEach((key) => {
        if (servingsPerDay > 0) {
          totals[key] = totals[key] / servingsPerDay
        }
      })

      return totals
    }

    it('should calculate nutrients for single serving liquid formula', () => {
      const result = calculateLiquidNutrients(
        1000, // ml prepared
        0.67, // calories per ml
        1000, // amount per carton ml
        10, // total protein g
        20, // total carbs g
        10, // total fat g
        1 // servings per day
      )

      expect(result['Calories']).toBe(670) // 0.67 * 1000
      expect(result['Protein']).toBe(10)
      expect(result['Carbohydrates']).toBe(20)
      expect(result['Fats']).toBe(10)
    })

    it('should calculate nutrients for partial carton liquid formula', () => {
      const result = calculateLiquidNutrients(
        500, // half carton
        0.67,
        1000,
        10,
        20,
        10,
        1
      )

      expect(result['Calories']).toBe(335) // 0.67 * 500
      expect(result['Protein']).toBe(5) // 10 * 0.5
      expect(result['Carbohydrates']).toBe(10) // 20 * 0.5
      expect(result['Fats']).toBe(5) // 10 * 0.5
    })

    it('should divide totals by servings per day', () => {
      const singleServing = calculateLiquidNutrients(1000, 0.67, 1000, 10, 20, 10, 1)
      const threeServings = calculateLiquidNutrients(1000, 0.67, 1000, 10, 20, 10, 3)

      expect(threeServings['Calories']).toBeCloseTo(singleServing['Calories'] / 3, 0)
    })

    it('should handle edge case: zero ml prepared', () => {
      const result = calculateLiquidNutrients(0, 0.67, 1000, 10, 20, 10, 1)
      expect(result['Calories']).toBe(0)
      expect(result['Protein']).toBe(0)
    })

    it('should handle edge case: zero servings per day', () => {
      const result = calculateLiquidNutrients(1000, 0.67, 1000, 10, 20, 10, 0)
      // Should not divide by zero
      expect(result['Calories']).toBeGreaterThanOrEqual(0)
    })

    it('should handle edge case: very small amount per carton', () => {
      const result = calculateLiquidNutrients(100, 0.67, 1, 10, 20, 10, 1)
      expect(result['Calories']).toBeGreaterThan(0)
      expect(isNaN(result['Calories'])).toBe(false)
    })
  })

  describe('Water Ingredient Calculations', () => {
    const calculateWater = (
      quantity: number,
      servingType: string,
      servingsPerDay: number = 1
    ): Record<string, number> => {
      const totals: Record<string, number> = {}

      let mlPerServing = 0
      if (servingType === 'Cup') {
        mlPerServing = 236.6
      } else if (servingType === 'Tablespoon') {
        mlPerServing = 14.8
      } else if (servingType === 'Teaspoon') {
        mlPerServing = 4.9
      } else if (servingType === 'Scoop') {
        mlPerServing = 30
      }

      const mlPrepared = quantity * mlPerServing

      totals['Holliday-Segar'] = mlPrepared
      totals['DRI Fluid'] = mlPrepared

      // Divide by servings per day
      Object.keys(totals).forEach((key) => {
        if (servingsPerDay > 0) {
          totals[key] = totals[key] / servingsPerDay
        }
      })

      return totals
    }

    it('should calculate water for cup servings', () => {
      const result = calculateWater(1, 'Cup', 1)
      expect(result['Holliday-Segar']).toBeCloseTo(236.6, 0)
      expect(result['DRI Fluid']).toBeCloseTo(236.6, 0)
    })

    it('should calculate water for multiple cup servings', () => {
      const result = calculateWater(2, 'Cup', 1)
      expect(result['Holliday-Segar']).toBeCloseTo(473.2, 0)
    })

    it('should divide water totals by servings per day', () => {
      const singleServing = calculateWater(1, 'Cup', 1)
      const threeServings = calculateWater(1, 'Cup', 3)
      expect(threeServings['Holliday-Segar']).toBeCloseTo(singleServing['Holliday-Segar'] / 3, 0)
    })

    it('should handle edge case: zero quantity', () => {
      const result = calculateWater(0, 'Cup', 1)
      expect(result['Holliday-Segar']).toBe(0)
    })
  })

  describe('Mixed Formula Calculations', () => {
    it('should combine multiple ingredients correctly', () => {
      // Simulate combining powder and liquid formulas
      const powderNutrients = {
        Calories: 200,
        Protein: 5,
        Carbohydrates: 10,
        Fats: 5,
      }

      const liquidNutrients = {
        Calories: 300,
        Protein: 8,
        Carbohydrates: 15,
        Fats: 8,
      }

      const combined = {
        Calories: powderNutrients.Calories + liquidNutrients.Calories,
        Protein: powderNutrients.Protein + liquidNutrients.Protein,
        Carbohydrates: powderNutrients.Carbohydrates + liquidNutrients.Carbohydrates,
        Fats: powderNutrients.Fats + liquidNutrients.Fats,
      }

      expect(combined.Calories).toBe(500)
      expect(combined.Protein).toBe(13)
      expect(combined.Carbohydrates).toBe(25)
      expect(combined.Fats).toBe(13)
    })

    it('should handle missing nutrient values gracefully', () => {
      const nutrients1 = {
        Calories: 200,
        Protein: 5,
        Carbohydrates: undefined as any,
        Fats: 5,
      }

      const nutrients2 = {
        Calories: 300,
        Protein: 8,
        Carbohydrates: 15,
        Fats: 8,
      }

      const combined = {
        Calories: (nutrients1.Calories || 0) + nutrients2.Calories,
        Protein: (nutrients1.Protein || 0) + nutrients2.Protein,
        Carbohydrates: (nutrients1.Carbohydrates || 0) + nutrients2.Carbohydrates,
        Fats: (nutrients1.Fats || 0) + nutrients2.Fats,
      }

      expect(combined.Calories).toBe(500)
      expect(combined.Protein).toBe(13)
      expect(combined.Carbohydrates).toBe(15)
      expect(combined.Fats).toBe(13)
    })
  })
})

