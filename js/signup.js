
async function post(email,password){
    if(!email||!password){
        const para = document.querySelector('.para1');
        para.classList.add('js-para');
        para.innerHTML = 'Please Provide Right email and pass';

        return
    }
    try{
        const response= await fetch('http://3.110.133.108:3000/signup',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                email:email,
                password:password
            })
    
        });
        if (!response.ok) {
            const para = document.querySelector('.para1');
            para.classList.add('js-para');
            para.innerHTML = 'User already exsist';
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Signup successful:', data);

        
        document.querySelector('.js-email').value = '';
        document.querySelector('.js-pass').value = '';

        document.querySelector('.para1').innerHTML = 'ACCOUNT CREATED SUCCESSFULLY';
        setTimeout(()=>{
            window.location.href = "signin.html";
        },1500);
        

    }
    catch(err){
        console.log(err);
    }
    
}


document.querySelector('.js-create-button').addEventListener('click',()=>{
    const email=document.querySelector('.js-email').value;
    const password=document.querySelector('.js-pass').value;
    console.log(email,password);
    
    post(email,password);

})