import './App1.css';

import {useState} from 'react';

function Header(props){
   // console.log(props.title)
    return(
        <header>
            <h1><a href = "/" onClick={(event)=>{
                event.preventDefault();
                props.onChangeMode();
            }}>{props.title}</a></h1>
        </header>
    )
}
function Nav(props){
    const lis = [];
    for(let i=0; i< props.topics.length; i++){
        let t = props.topics[i];
        lis.push(<li key={t.id}><a id = {t.id} href={t.url} onClick = {
                                                (event) => {
                                                    event.preventDefault();
                                                    //event.target : a tag
                                                    props.onChangeMode(event.target.id);
                                                }
                                                }>{t.title}</a></li>);
    }
    return(
        <nav>
            <ol>
                {lis}
            </ol>
        </nav>  
    )
}
function Article(props){
    return(
      <article>
            <h2>{props.title}</h2>
            {props.body}
        </article>  
    )
}
function Create(props){
    return(
        <article>
            <h2>Create</h2>
            <form onSubmit={event=>{
                event.preventDefault();
                const title = event.target.title.value;
                const body = event.target.body.value;
                props.onCreate(title, body);
            }}>

                <p><input type = "text" id = "title" name = "title" placeholder = "title" /></p>
                <p><textarea name = "body" id = 'body' placeholder = 'body'></textarea></p>
                <p><input type = 'submit' value = "Create" /></p>
            </form>
        </article>
    )
}
function Update(props){
    const [title, setTitle] = useState(props.title);
    const [body, setBody] = useState(props.body);
    return(
        <article>
            <h2>Update</h2>
            <form onSubmit={event=>{
                event.preventDefault();
                const title = event.target.title.value;
                const body = event.target.body.value;
                props.onUpdate(title, body);
            }}>

                <p><input type = "text" value = {title} id = "title" name = "title" placeholder = "title"
                    onChange={event=>{
                        setTitle(event.target.value);
                    }} /></p>
                <p><textarea name = "body" value = {body} id = 'body' placeholder = 'body'
                    onChange={event=>{
                        setBody(event.target.value);
                    }}></textarea></p>
                <p><input type = 'submit' value = "Update" /></p>
            </form>
        </article>
    )
}
function App1(){
    // let _mode = useState('WELCOME');
    // const mode = _mode[0];
    // const setMode = _mode[1];
    const [mode, setMode] = useState('WELCOME');
    const [id, setId] = useState(null);
    const [nextId, setNextId] = useState(4);

    const [topics, setTopic] = useState([
        {id:'1', title:'html', body:'html is ...', url:'/read/1'}
        , {id:'2', title: 'Css', body:'css is ...', url:'/read/2'}
        , {id:'3', title: 'Javascript', body: 'Javascript is ...', url:'/read/3'}
    ]);
    let content = null;
    let contextControl = null;
    if(mode === 'WELCOME'){
        content = <Article title="Welcome" body = "hello, Web" />
    }else if(mode ==='READ' ){
        let title, body = null;
        for(let i=0; i< topics.length; i++){
            // console.log(topics[i].id, id);
            if(topics[i].id ===id){
                title = topics[i].title;
                body = topics[i].body;
            }
        }
        content = <Article title={title} body={body} />;
        contextControl = <><li><a href={'/update/'+id} onClick = {event=>{
                            event.preventDefault();
                            setMode('UPDATE');
                        }}>Update</a></li>
                        <li><input type = "button" value = "Delete" onClick = {()=>{
                            const newTopics = [];
                            for(let i=0; i< topics.length; i++){
                                if(topics[i].id !== id){
                                    newTopics.push(topics[i]);
                                }
                            }
                            setTopic(newTopics);
                            setMode('WELCOME');
                        }}/></li>
                        </>;
    }else if(mode === 'CREATE'){
        content = <Create onCreate = {(title, body)=>{
            const newTopic = {id:nextId.toString(), title: title, body : body, url: "/read/"+nextId}
            const newTopics = [...topics]; 
            newTopics.push(newTopic);
             //topics에 바로 push하면  setTopic에서는 같은 객체라고 생각하여 작동하지 않는다.
            setTopic(newTopics);
            setMode("READ");
            setId(nextId);
            setNextId(nextId+1);
        }} />;
    }else if(mode ==='UPDATE'){
        let title, body = null;
        for(let i = 0; i < topics.length; i++){
            if(topics[i].id === id){
                title = topics[i].title;
                body = topics[i].body;
                break;
            }
        }
        content = <Update title = {title} body = {body} onUpdate = {(title, body) => {
            const updatedTopic = {id : id, title : title, body : body, url : '/read/'+id };
            const newTopics = [...topics];

            for(let i=0; i< newTopics.length; i++){
                if(newTopics[i].id === id){
                    newTopics[i] = updatedTopic;
                    break;
                }
            }
            setTopic(newTopics);
            setMode("READ");
            setId(id);
        }} />
    }
    
    return(
        // <div className = "App1">
        //     Hello React!
        // </div>
        <div>
            <Header title = "WEB" onChangeMode={()=>{
                setMode('WELCOME');
                // alert('Header');
            }}></Header>
            <Nav topics = {topics} onChangeMode={(_id)=>{
                setMode('READ');
                // alert(id);
                setId(_id);
            }} />
            {content}
            <ul>
            <li><a href="/create" onClick={event=>{
                event.preventDefault();
                setMode('CREATE');
            }}>Create</a></li>
            {contextControl}
            </ul>
        </div>
    )
}

export default App1;