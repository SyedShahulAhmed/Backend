import {serve} from 'bun'

serve({
    fetch(req){
        const url = new URL(req.url);
        if(url.pathname === '/') {
            return new Response('HELLO WORLD',{status:200})
        }else if(url.pathname === '/login'){
            return new Response('LOGIN PAGE',{status:200})
        }else{
            return new Response('404 PAGE NOT FOUND',{status:404})
        }
    },
    port:3001,
    hostname:'127.0.0.1',
})