const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carContext = carCanvas.getContext("2d");
const networkContext = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width * 0.9)
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const N = 1;
const cars = generateCars(N);

let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
    // bestCar.brain = JSON.parse(localStorage.getItem("bestBrain"));
    for (let i=0; i<cars.length; i++) { 
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
        if (i!=0) {
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColour()),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColour()),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColour()),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2, getRandomColour()),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2, getRandomColour()),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2, getRandomColour()),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2, getRandomColour()),
];

animate();

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N) {
    const cars = [];
    for (let i=1; i<=N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS"));
    }
    return cars;
}

function animate(time) {
    for (let i=0; i<traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    for (let i=0; i<cars.length; i++) {
        let car = cars[i];
        car.update(road.borders, traffic);
    }

    bestCar = cars.find(c=>c.y==Math.min(...cars.map(c=>c.y)));


    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carContext.save();
    carContext.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carContext);
    for (let i=0; i<traffic.length; i++) {
        traffic[i].draw(carContext, "red");
    }
    carContext.globalAlpha = 0.2;
    for (let i=0; i<cars.length; i++) {
        let car = cars[i];
        car.draw(carContext, "blue");
    }
    carContext.globalAlpha = 1;
    bestCar.draw(carContext, "blue", true);

    carContext.restore();

    networkContext.lineDashOffset = -time/50;
    Visualiser.drawNetwork(networkContext, bestCar.brain);
    requestAnimationFrame(animate);
}