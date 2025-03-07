let email = localStorage.getItem('email');
let taskArray = JSON.parse(localStorage.getItem('tasks')) || [];

// ✅ Render all tasks when page loads
if (taskArray.length > 0) {
    taskArray.forEach((task) => {
        render(task);
    });
}

// ✅ Function to render a single task
function render(task) {
    const parent = document.querySelector('.content');

    const div = document.createElement('div');
    div.classList.add('js-index');
    div.classList.add('tasks');
    const p = document.createElement('p');
    p.innerHTML = task;

    const button = document.createElement('button');
    button.innerHTML = 'Delete';
    button.classList.add('js-delete');

    div.appendChild(p);
    div.appendChild(button);
    parent.appendChild(div);
}
async function delet(task,taskDiv){
    try{
        const response=await fetch('http://13.201.32.98:3000/deltask',{
            method:"PUT",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({email,task})
        });
        const data= await response.json();
        if(!response.ok){
            throw new Error('Http status code ', response.status);
        }
        taskDiv.remove();

        // ✅ Remove task from `localStorage`
        taskArray = taskArray.filter(task => task !== taskText);
        localStorage.setItem('tasks', JSON.stringify(taskArray));

    }
    catch(err){
        console.log('there was an error');
        return 0;
    }


}
// ✅ Event Delegation for Delete Buttons
document.querySelector('.content').addEventListener('click', (event) => {
   
    if (event.target.classList.contains('js-delete')) {
        
        const taskDiv = event.target.closest('.js-index'); // ✅ Find the task div
        const taskText = taskDiv.querySelector('p').innerText;
        delet(taskText, taskDiv); // ✅ Get task text
       
            // ✅ Remove task from UI
        
        
}
});


// ✅ Function to send task to backend & update UI
async function post(inputTask) {
    if (!inputTask) {
        document.querySelector('.js-err').innerHTML = `⚠️ Enter the task first`;
        return;
    }
    try {
        const response = await fetch('http://13.201.32.98:3000/createtodo', {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // ✅ Fixed headers
            body: JSON.stringify({ email, inputTask })
        });

        if (!response.ok) {
            document.querySelector('.js-err').innerHTML = `❌ Error creating the task`;
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        document.querySelector('.js-input').value = '';

        // ✅ Merge new task with existing tasks in localStorage
        let taskArray = JSON.parse(localStorage.getItem('tasks')) || [];
        taskArray.push(inputTask);
        localStorage.setItem('tasks', JSON.stringify(taskArray));

        // ✅ Render new task in the UI
        render(inputTask);

        // ✅ Show success message
        document.querySelector('.js-err').innerHTML = '✅ Task created successfully';
        setTimeout(() => {
            document.querySelector('.js-err').innerHTML = '';
        }, 2000);
    } catch (err) {
        document.querySelector('.js-err').innerHTML = `❌ Network error while creating the task`;
        console.log('❌ There was a network error:', err);
    }
}

// ✅ Event listener for Add Task button
document.querySelector('.js-addtodo').addEventListener('click', () => {
    const inputTask = document.querySelector('.js-input').value;
    post(inputTask);
});

document.querySelector('.singout').addEventListener('click',()=>{
    localStorage.clear();
    window.location.href='signin.html';
})