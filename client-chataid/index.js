import Bot from './assets/bot.svg'
import User from './assets/user.svg'

const container = document.querySelector('#chat_container')
const form = document.querySelector('form')


let loadid = ' ';

// setinterval returns a uniqueid which we can use to clear later

const loader = (element) => {

element.textContent=' '

loadid = setInterval(() => {

element.textContent+='.';
if(element.textContent.length > 4 ) element.textContent = ' ';


},300)

}

const Typetext = (element,text) => {

  let index = 0

  let textid = setInterval(() => {

    if(index<text.length)
      {
        element.innerHTML+=text.charAt(index)
        index+=1
      }
      else
        {
          clearInterval(textid)
        }

  },20)
}

const UniqueId = () => {

  const dateid = Date.now()
  const random = Math.random()

  const hex = random.toString(16)

  return `id-${dateid}-${hex}`
}







const chatBar = (Ai,message,uniqueid) => {

    return `
     <div class='wrapper ${Ai && 'ai'}'>
     <div class='chat'>
     <div class='profile'>
     <img src=${Ai?Bot:User} alt=${Ai?'Bot':'User'} />
     </div>
     <div class='message' id=${uniqueid && uniqueid}>${message}</div>
     </div>

     


    </div>
    `
}


const handleSubmit = async () => {

  const data = new FormData(form)

//user strip
  container.innerHTML += chatBar(false,data.get('ask'))

  form.reset() // empty input

  const id = UniqueId()

  //bot strip 

  container.innerHTML += chatBar(true," ",id)

  container.scrollTop = container.scrollHeight;

  const message = document.getElementById(id)

  loader(message)

const request = await fetch('http://localhost:5000',{

  method:'POST',
  headers:{
    'Content-Type':'application/json'
  },
  body:JSON.stringify({
    ask:data.get('ask')
  })
})

clearInterval(loadid)
message.innerHTML = ''

if(request.ok)
  {
    const response = await request.json();
    const parsed = response.bot.trim()

    Typetext(message,parsed)
  }
  else
    {
      message.innerHTML = 'Something went wrong'
    }




}


document.addEventListener('submit',handleSubmit);

document.addEventListener('keyup',(e) => {

  if(e.keyCode === 13)
    {
      handleSubmit(e)
    }
})
