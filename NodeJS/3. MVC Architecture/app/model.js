class Animal {
  constructor(name, color) {
    this.name = name;
    this.color = color;
  }
}

const animalsArray = [];
const addAnimal = (animal) => animalsArray.push(animal);

export { Animal, animalsArray, addAnimal };
