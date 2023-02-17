// all exports from main will now be available as main.X
import * as main from './main';

  test("modeSwitch changes mode", () => {
    //checks that mode switched back and forth between calls
    expect(main.modeSwitch()).toBe(false)
    expect(main.modeSwitch()).toBe(true)
    expect(main.modeSwitch()).toBe(false)
  });

  test("csvLoader incorrect loads doesn't affect active state", () => {
    expect(main.returnActiveData()).toEqual([[]])
    
    expect(main.csvLoader("")).toBe(false)
    expect(main.csvLoader("fiuwebn")).toBe(false)
    expect(main.csvLoader("dhjscv sefwef")).toBe(false)
    expect(main.csvLoader("/test/dataOne.cs")).toBe(false)

    expect(main.returnActiveData()).toEqual([[]])
  });

  test("csvLoader correct loads affects active", () => {
    expect(main.csvLoader("/test/dataThree.csv")).toBe(true)
    expect(main.returnActiveData()).toEqual([["hello"], ["elements"], ["items"], ["objects"]])

    expect(main.csvLoader("/test/dataTwo.csv")).toBe(true)
    expect(main.returnActiveData()).toEqual([["hi"]])

    expect(main.csvLoader("/test/dataOne.csv")).toBe(true)
    expect(main.returnActiveData()).toEqual([["1","2","3"], ["a", "b", "c"], ["true", "false", "3"], ["3", "6", "9"]])
  });

  test("csvLoader incorrect loads doesn't unload previous", () => {
    expect(main.csvLoader("/test/dataOne.csv")).toBe(true)
    expect(main.csvLoader("dhjscv sefwef")).toBe(false)
    expect(main.returnActiveData()).toEqual([["1","2","3"], ["a", "b", "c"], ["true", "false", "3"], ["3", "6", "9"]])
  });

  test("parseCommand correct commands", () => {
    //no args passed for all cases except search, because all cases except search handle not having proper args
    expect(main.parseCommandCall("echo")).toBe(true)
    expect(main.parseCommandCall("view")).toBe(true)
    expect(main.parseCommandCall("mode")).toBe(true)
    expect(main.parseCommandCall("help")).toBe(true)
    expect(main.parseCommandCall("load_file")).toBe(true)
    expect(main.parseCommandCall("search 2")).toEqual([["1","2","3"], ["a", "b", "c"], ["true", "false", "3"], ["3", "6", "9"]])
    expect(main.parseCommandCall("search 2 3")).toEqual([["1","2","3"], ["true", "false", "3"]])
  })

  test("parseCommand incorrect commands", () => {
    expect(() => {main.parseCommandCall("search")}).toThrow()
    expect(main.parseCommandCall("")).toBe(false)
    expect(main.parseCommandCall("wiefubwiefu")).toBe(false)
    expect(main.parseCommandCall("echoview")).toBe(false)
    expect(main.parseCommandCall("echosomething")).toBe(false)
    expect(main.parseCommandCall("echosomething")).toBe(false)
    expect(main.parseCommandCall("helpme")).toBe(false)
  })
  
  /*These are csvSearcher tests! This is more to prove that our mocking structure works and deal with varied input, 
    rather than mandating that there be predefined commands and arguments for our mock. The data is predefined, but
    what the user might search (and how that is displayed!) is not.*/

  test("csvSearcher Out Of Bounds", () => {
    main.csvLoader("/test/dataOne.csv")
    expect(() => {main.csvSearcher("-1", "owef")}).toThrow()
    expect(() => {main.csvSearcher("5", "")}).toThrow()
    
    main.csvLoader("/test/dataFive.csv")
    expect(() => {main.csvSearcher("ewiubqwdq", " ")}).toThrow()
    expect(() => {main.csvSearcher("some words", " ")}).toThrow()
    expect(() => {main.csvSearcher("some2words", " ")}).toThrow()
  });

  test("csvSearcher Search by num index", () => {
    main.csvLoader("/test/dataOne.csv")
    expect(main.csvSearcher("1", "hi")).toEqual([])
    expect(main.csvSearcher("0", "a")).toEqual([["a", "b", "c"]])
    expect(main.csvSearcher("2", "3")).toEqual([["1","2","3"], ["true", "false", "3"]])
    
    main.csvLoader("/test/dataSeven.csv")
    expect(main.csvSearcher("0", "hey")).toEqual([["hey", "hi", "hello", "what\'s up"]])
    expect(main.csvSearcher("1", "hello")).toEqual([])
    expect(main.csvSearcher("3", "4th")).toEqual([["four", "4", "fourty4", "4th"]])
  });

  test("csvSearcher Search by text header", () => {
    main.csvLoader("/test/dataSeven.csv")
    expect(main.csvSearcher("four", "hey")).toEqual([["hey", "hi", "hello", "what\'s up"]])
    expect(main.csvSearcher("4th", "dance")).toEqual([["wioeufn", "weio", "wefuo", "dance"]])
    //The header being only a number indicates interpretation as an int index, not a text header.
    expect(() => {main.csvSearcher("4", "hi")}).toThrow()
  });

  test("csvSearcher no data", () => {
    main.csvLoader("/test/dataSix.csv")
    expect(() => {main.csvSearcher("", "")}).toThrow()
  })

  test("csvSearcher empty string", () => {
    main.csvLoader("/test/dataEight.csv")
    expect(main.csvSearcher("", "")).toEqual([[""]])
    expect(main.csvSearcher("0", "")).toEqual([[""]])
    expect(main.csvSearcher("", "eq")).toEqual([])
  })




