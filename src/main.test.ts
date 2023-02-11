// all exports from main will now be available as main.X
import * as main from './main';

test('is 1 + 1 = 2?', () => {    
  expect(1 + 1).toBe(2)  
})