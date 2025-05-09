interface Geo {
  response: {
    service: {
      name: string;
      version: string;
      operation: string;
      time: string;
    };
    status: string;
    input: {
      type: string;
      address: string;
    };
    refined: {
      text: string;
      structure: {
        level0: string;
        level1: string;
        level2: string;
        level3: string;
        level4L: string;
        level4LC: string;
        level4A: string;
        level4AC: string;
        level5: string;
        detail: string;
      };
    };
    result: {
      crs: string;
      point: {
        x: string;
        y: string;
      };
    };
  };
}
