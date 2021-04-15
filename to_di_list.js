const readline = require('readline');
const fs = require('fs');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

//menu

let path = 'list_file.txt';
let counter = 0;
let list = '';
const commandLine = '(v) View ● (n) New ● (cX) Complete ● (dX) Delete ● (s) Save ● (q) Quit';
const welcomeMsg = `Welcome to ToDo CLI!\n──────────────────\n${commandLine}`;


if(process.argv[2] === undefined){
path = 'list_file.txt';
fs.readFile(path, (err, data)=>{
    if (err) throw err;
    list = data.toString();
    if(list.length === 0){
        counter = 0;
        menu()
    } else {
        list1 = data.toString().split('\n');
        return counter = Number(list1[list1.length-1][0])+1;
    }
})
} else {
    let path = process.argv[2];
    fs.readFile(path,(err, data)=>{
        if (err) throw err;
        const obj = JSON.parse(data);
for(let i = 0; i<obj.length; i++){
     if(obj[i].completed){
     let text = `${counter} ✘ ${obj[i].title}`
    if(counter !== 0){
                list += `\n${text}`;
    } else {
        list += text;
    }
 } else {
    let text = `${counter} ☐ ${obj[i].title}`;
    if(counter !== 0){
                list += `\n${text}`;
    } else {
        list += text;
    }
 }
 counter++;
}
list.split(' ').sort();
fs.writeFile('list_file.txt', list, (err)=>{if(err) throw err})
    });
};

console.log(welcomeMsg);
const menu = () =>{
rl.question('', (answer)=>{
    let num;
    if (answer.includes("c") || answer.includes("d")) {
        answer.length < 2 ? answer = '' : num = answer.slice(1);
    }
    switch(answer.toLowerCase()){
        case `v`:
            return viewTask();
            break;
        case `n`:
            return addTask();
            break;
        case `c${num}`:
            return markComplete(num);
            break;
        case `d${num}`:
            return deleteTask(num);
            break;
        case `q`: 
        quit();
        break;
        case 's':
            return saveFile();
            break;
        default:
            console.log('🛑Invalid input! Please try again!🛑');
            menu();

    }
})

};


// view list
const viewTask = () =>{
    if(list.length === 0){
        console.log('🛑Ooops! Your task list is empty🛑');
    } 
     console.log(list);
     console.log(commandLine);
     menu();
};




// add new task
function addTask(){
    
    rl.question(`What is the new task?\n`, answer => {
        let text = `${counter} ☐ ${answer}`;
        if(counter !== 0){
            fs.appendFile(path, `\n${text}`, 'utf8',(err)=> {
                    if (err) throw err;
                    console.log(commandLine);
                    counter ++;
                    list += `\n${text}`;
                    // console.log('append')
                    menu()
                });
        } else {
            console.log(commandLine);
            fs.writeFile(path, text, (err)=>{if(err) throw err})
            counter ++;
            list += text;
            // console.log('new')
            menu()
        }
    })
};

// complete task
const markComplete = (taskNum) =>{
    let task = list.split('\n');
    // if(taskNum !== x[0]){
    //             console.log('🛑Ooops! This task number does not exist!🛑')
    //             menu();
    //             console.log(commandLine);
    //             }
        for(let x of task){
            if(x[0] === taskNum){
               let completed= x.replace('☐', '✘');
                console.log(`Completed task: ✘ ${x.slice(4)}`)
                task.splice(task.indexOf(x), 1, completed);
                // console.log(task)
                list = task.join('\n');
                // console.log(list);
                fs.writeFile(path, list, (err)=>{if(err) throw err});
                console.log(commandLine);
                menu();
            }
            
    }
};

// delete task
const deleteTask = taskNum =>{
    if(taskNum > list.length){
        console.log('🛑 Ooops! This task number does not exist!🛑')
        menu()
        console.log(commandLine);
    } else {
    let task = list.split('\n');
        for(let x of task){
            if(x[0] === taskNum){
                let deleted = task.splice(task.indexOf(x),1);
                console.log(`Deleted task: ❌ ${deleted}`);
                list = task.join('\n');
                fs.writeFile(path, list, (err)=>{if(err) throw err});
                console.log(commandLine);
                menu(); 
            }
        }
    }
};

// exit
const quit = () =>{
    console.log('Farewell! Come back soon!👋');
    process.exit()
};

const saveFile = () =>{
    
    rl.question('Where? ', answer=>{

        if(answer){
// I want to provide a choice to user in what format to save the list
// if file format specified as JSON it will be saved in that format, otherwise 
// it will be saved in easy to understand string format 
            if(answer.includes('.json')){
                let arr = [];
                // let obj = {};
                let listArray = list.split('\n');
                for(let i of listArray){
                    if(i.includes('✘')){
                        arr.push({"completed": true, "task": i.slice(4)})
                    } else {
                        arr.push({"completed": false, "task": i.slice(4)})
                    }
                }
                fs.writeFile(answer, JSON.stringify(arr), (err)=>{if(err) throw err});
                console.log(`List saved to ${answer}`)
                menu();
            } else {
               fs.writeFile(answer, list, (err)=>{if(err) throw err});
                console.log(`List saved to ${answer}`)
                menu(); 
            }
        
        } else {
        fs.writeFile('list.txt', list, (err)=>{if(err) throw err});
        console.log(`List saved to "list.txt`)
        menu();
        }
    })
}

menu();