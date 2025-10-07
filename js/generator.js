// generator.js (fixed version)

const Generator = (() => {
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const makeAdd = (a, b) => ({ a, b, op: "+", answer: a + b });
  const makeSub = (a, b) => ({ a, b, op: "−", answer: a - b });

  /**
   * Level 1: Easy (≤10)
   * - Addition: result ≤ 10
   * - Subtraction: result ≥ 0
   */
  function genEasy() {
    if (Math.random() < 0.5) {
      // Addition
      let x = randInt(0, 10);
      let y = randInt(0, 10 - x);
      return makeAdd(x, y);
    } else {
      // Subtraction
      let x = randInt(0, 10);
      let y = randInt(0, x);
      return makeSub(x, y);
    }
  }

  /**
   * Level 2: Medium (≤100 without carry/borrow)
   * - Addition: sum ≤ 100, no carry (units sum ≤ 10)
   * - Subtraction: result ≥ 0, no borrow (a_units ≥ b_units)
   */
  function genMediumNoCarry() {
    let attempts = 0;
    const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
      attempts++;
      const add = Math.random() < 0.5;
      
      if (add) {
        // Addition without carry
        const a = randInt(0, 100);
        const b = randInt(0, 100);
        const ones = (a % 10) + (b % 10);
        const sum = a + b;
        
        if (ones <= 10 && sum <= 100) {
          return makeAdd(a, b);
        }
      } else {
        // Subtraction without borrow
        let a = randInt(0, 100);
        let b = randInt(0, 100);
        
        // Ensure a ≥ b
        if (a < b) {
          const temp = a;
          a = b;
          b = temp;
        }
        
        // Check: no borrow needed (units digit of a ≥ units digit of b)
        if ((a % 10) >= (b % 10) && a - b >= 0) {
          return makeSub(a, b);
        }
      }
    }
    
    // Fallback: simple addition
    return makeAdd(5, 3);
  }

  /**
   * Level 3: Advanced (≤100 with carry/borrow)
   * - Addition: sum may require carry
   * - Subtraction: may require borrow
   */
  function genAdvancedWithCarry() {
    if (Math.random() < 0.5) {
      // Addition WITH carry
      // Strategy: make units sum > 10
      let u1 = randInt(0, 9);
      let u2 = randInt(10 - u1, 9); // Forces carry
      let t1 = randInt(0, 9);
      let t2 = randInt(0, 9 - t1); // Keep result ≤ 99
      
      let a = t1 * 10 + u1;
      let b = t2 * 10 + u2;
      
      // Ensure result ≤ 100
      if (a + b > 100) {
        t2 = randInt(0, Math.max(0, 9 - t1 - 1));
        b = t2 * 10 + u2;
      }
      
      return makeAdd(a, b);
    } else {
      // Subtraction WITH borrow
      // Strategy: make a_units < b_units
      let u1 = randInt(0, 8);
      let u2 = randInt(u1 + 1, 9); // Forces borrow
      let t1 = randInt(1, 9);
      let t2 = randInt(0, t1);
      
      let a = t1 * 10 + u1;
      let b = t2 * 10 + u2;
      
      // Ensure a > b and borrow is needed
      if (a <= b || (a % 10) >= (b % 10)) {
        // Adjust to force borrow
        if (a <= b) {
          const temp = a;
          a = b;
          b = temp;
        }
        // Make sure units need borrow
        if ((a % 10) >= (b % 10)) {
          a = Math.floor(a / 10) * 10 + Math.min(a % 10, (b % 10) - 1);
          if (a < 0) a = 0;
        }
      }
      
      // Final safety check
      if (a < b) {
        const temp = a;
        a = b;
        b = temp;
      }
      
      return makeSub(a, b);
    }
  }

  /**
   * Main generator function
   * @param {string} level - "easy", "medium", or "advanced"
   * @returns {Object} Task object with a, b, op, answer
   */
  function generateTask(level) {
    switch (level) {
      case "easy":
        return genEasy();
      case "medium":
        return genMediumNoCarry();
      case "advanced":
        return genAdvancedWithCarry();
      default:
        return genEasy();
    }
  }

  return { 
    generateTask, 
    genEasy, 
    genMediumNoCarry, 
    genAdvancedWithCarry 
  };
})();