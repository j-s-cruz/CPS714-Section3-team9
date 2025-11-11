export const getData = async () => {
  // Simulate fetching data (e.g., from an API or database)

  return new Promise((resolve) => {
    resolve(
        [
        ["Age", "Weight"],
        [4, 16],
        [8, 25],
        [12, 40],
        [16, 55],
        [20, 70],
    ]);
  });
  
//   return new Promise((resolve) => {
//       resolve([
//         ['Month', 'Active Members'],
//         ['Jan', 120],
//         ['Feb', 150],
//         ['Mar', 170],
//         ['Apr', 160],
//         ['May', 200],
//       ]);
//   });
};