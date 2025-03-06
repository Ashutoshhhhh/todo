const express=require('express');
const path=require('path');
const cors=require('cors');
const fs=require('fs');
const app=express();
app.use(express.json())
app.use( express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname,'js')));
app.use(cors());




app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'signin.html'));
});

app.post('/signup',(req,res)=>{
    const {email,password}=req.body;
    let emailPassArray=[];
    try{
        const data=fs.readFileSync('email-pass.json','utf-8');
        emailPassArray=data?JSON.parse(data):[];
    }
    catch(err){
        return res.status(500).json({message:err});
    }
    const userExsist=emailPassArray.some((item,index)=>item.email===email);
    if(userExsist){
        return res.status(409).json({message:'the user already exsist'});
    }
    emailPassArray.push({email,password});
    try{
        const safeEmail = email.replace(/[@.]/g, "_"); 
        fs.writeFileSync(`${safeEmail}.json`,JSON.stringify({ tasks: [] }, null, 2),'utf-8');
        fs.writeFileSync('email-pass.json',JSON.stringify(emailPassArray,null,2),'utf-8');
        return res.status(201).json({msg:'you have created account successfully'});
    }
    catch(err){
        return res.status(500).json({error:err});
    }
});
app.post('/signin',(req,res)=>{
    const {email,password}=req.body;
    let dataArray=[];
    try{
        const data=fs.readFileSync('email-pass.json','utf-8');
        dataArray=data?JSON.parse(data):[];
    }
    catch(err){
        return res.status(500).json({message:`there was an error reading the email-passfile ${err}`});
    }
    const matchedItem=dataArray.find((item,index)=>{
        return (item.password===password && item.email===email);
    })
    if(!matchedItem){
        return res.status(401).json({message:'User not found'});
    }
    const safeEmail=email.replace(/[@.]/g,"_");
    let userTask=[];
    try{
        const data=fs.readFileSync(`${safeEmail}.json`,'utf-8');
        userTask=data?JSON.parse(data).tasks:[]

       }
    catch(err){
        return res.status(500).json({message:`There was error reading the user task data ${err.message}`});

    }
    return res.status(200).json({message:'login successful',tasks:userTask,email});

});

app.post('/createtodo',(req,res)=>{
    const {email,inputTask}=req.body;
    if(!email || !inputTask){
        return res.status(400).json({message:'Plesase send correct email and task'});
    }
    const safeEmail=email.replace(/[@.]/g,"_");
    let tasks=[];
    try{
        const data=fs.readFileSync(`${safeEmail}.json`,'utf-8');
        tasks=data?JSON.parse(data).tasks:[];
    }
    catch(err){
        return res.status(500).json({meassage:'There was error reading the user file ',error:err});
    }
    if(!Array.isArray(tasks)){
        tasks=[];
    }
    tasks.push(inputTask);
    try{
        fs.writeFileSync(`${safeEmail}.json`,JSON.stringify({tasks:tasks},null,2));
        return res.status(201).json({message:'the task was written',task:tasks});
    }
    catch(err){
        return res.status(500).json({message:'There was error wrting the task'});
    }
});
app.put('/deltask',(req,res)=>{
    const {email,task}=req.body;
    if(!email||!task)
    {
        return res.status(400).json({message:'There was no email or task'});
    }
    const safeEmail=email.replace(/[@.]/g,"_");
    let taskArray=[];
    try{
        const data=fs.readFileSync(`${safeEmail}.json`,'utf-8');
        taskArray=data?JSON.parse(data).tasks:[];
    }
    catch(err){
        return res.status(500).json({message:'error reading the user file '});
    }
    const index=taskArray.findIndex(item=>{
         return item===task;
    })
    if (index !== -1) {
        taskArray.splice(index, 1);
    } else {
        return res.status(404).json({ message: "Task not found",index:index,task:task});
    }
    
    
    try{
        fs.writeFileSync(`${safeEmail}.json`,JSON.stringify({tasks:taskArray},null,2),'utf-8');
        return res.status(200).json({message:'task was deleted successfully'});
    }
    catch(err){
        return res.status(500).json({message:'error while deleting the task'});
    }
})



app.listen(3000);