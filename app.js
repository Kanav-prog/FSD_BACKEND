//function in js:block of code 
//synrax :
//function frame(){
//}
//fname();
function add ( num1 , num2){
    console.log(num1 )

}
add(2,1);
function add(num1,num2){
    return num1 + num2;
}
add(2,1);
//arrow function  
//varibale in js:container to store data 
//syntax:()=>{}
    const add=()=>{
        console.log("arrow function")
    }
    add();
    const add(num1,num2)=>{


        return num1 + num2;
    }
    console.log(add(2,1));
function addnum(){
    console.log
    function sayHi(){
        console.log("this is a callback function");
    }
    function Hello(){
        console.log("Hello World!");
    }
    //create a function display(callback) that print "welcome to "