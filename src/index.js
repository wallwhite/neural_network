import 'global.scss';
import Perceptron from './Perceptron';

const axisWidth = 350;
const initialSet = [
  {name:"Бельгія",x1:9.5,x2:492,cat:1},
  {name:"Чехія",x1:10.2,x2:215,cat:0},
  {name:"Данія",x1:9.2,x2:324,cat:0},
  //{name:"Пиранья",x1:30,x2:10,cat:0},
  {name:"Німеччина",x1:11.2,x2:3677,cat:1},
  {name:"Естонія",x1:10.7,x2:27,cat:0},
  {name:"Ірландія",x1:6.4,x2:333,cat:1},
  //{name:"Гиена",x1:34,x2:120,cat:0},
];
const app = new Vue({
  el: '#app',
  data: {
    trainingSet: initialSet,
    normalizedSet: [],
    predictedSet: [],
    isTraining:false,
    isMounted:false,
    trained: false,
    lineWidth: axisWidth,
    axisValues: Array.from(Array((axisWidth / 10)+1)).map((x,i)=> 1/axisWidth*10*i),
    showLine: false,
    lineCoords: {x1:0,y1:0,x2:0,y2:0},
    perceptron: new Perceptron(),
    randomValue: [Math.random().toFixed(2),Math.random().toFixed(2)]
  },
  methods: {
    genRandom() {
      this.randomValue = [Math.random().toFixed(2),Math.random().toFixed(2)]
    },
    predictValue() {
      const [x1,x2] = this.randomValue;
      this.predictedSet.push({
        name: `[${~~(x1*this.maxX)}teeth , ${~~(x2*this.maxY)}cm]`,
        x1,
        x2,
        reveal:true,
        cat: this.perceptron.predict([x1,x2])
      });
      this.genRandom();
    },
    trainPerceptron() {
      this.perceptron = new Perceptron();
      this.predictedSet = [];
      this.trained = false;
      this.isTraining = true;
      this.showLine = false;
      this.normalizedSet = this.normalize;

      //this.normalizedSet.forEach(e => e.reveal = true); return;
      this.normalizedSet.forEach((t,i) => {
        this.perceptron.train([t.x1,t.x2],t.cat);
        setTimeout(_=>{t.reveal = true},i*100);
      });

      const itSpeed = 50;
      setTimeout(_=>{

        let it = 0;

        // Learn callback
        this.perceptron.learn(_=>{
          it++;
          setTimeout(function(that,w){
            return function(){
              that.showLine = true;
              const lineCoords = {
                x1:0,
                x2:1,
                y1:-(w[0]*0+w[2])/w[1],
                y2:-(w[0]*1+w[2])/w[1],
              };
              that.lineCoords = lineCoords;
            }
          }(this,this.perceptron.weights.slice()),it*itSpeed);
        });

        // Trained to true after.
        setTimeout(_=>{
          this.trained = true;
          this.isTraining = false;
        },it*itSpeed);

      },initialSet.length*itSpeed);
    }
  },
  mounted() {
    hljs.initHighlighting();
  },
  computed: {
    maxX() { return Math.max.apply(Math,this.trainingSet.map(t => t.x1)) },
    maxY() { return Math.max.apply(Math,this.trainingSet.map(t => t.x2)) },
    normalize() {
      const { trainingSet } = this;
      return trainingSet.map(t => {
        return Object.assign({},t,{
          x1: t.x1 / this.maxX,
          x2: t.x2 / this.maxY,
          reveal: false,
        });
      });
    },
    code() {
      let code = `\n`;
      this.normalize.forEach(t => {
        code += `p.train([${t.x1.toFixed(2)},${t.x2.toFixed(2)}],${t.cat});\n`;
      });
      return code;
    },
    yaxisValues() { return this.axisValues.slice().reverse() }
  }
});


window.app = app;
