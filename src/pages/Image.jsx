import React, { useEffect } from 'react'
import '../App.css';
import { BsArrowRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js'
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const supabaseUrl = 'https://ymifflojmeqlfytlxbhh.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const animationClass = 'transition duration-500 ease-in-out hover:scale-110 hover:translate-y-1'

function Image() {
    var userIp = '';
    const [text, setText] = React.useState('No Response Generated Yet');
    const [input, setInput] = React.useState('');
    const [resultFetched, setResultFetched] = React.useState(false);
    const [totalQueriesLeft, setTotalQueriesLeft] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(false);
    const [image_url, setImageUrl] = React.useState('');

    const onChange = (e) => {
        setInput(e.target.value);
    }
    const getUserIp = async () => {
        const ipAddress = await fetch('https://api.ipify.org?format=json')
        const { ip } = await ipAddress.json();
        if (ipAddress.status === 200) {
            return ip;
        }
        else {
            return 'error';
        }
    }
    const resetQueryLimit = async () => {
        const getCurrentTime = new Date();
        const ip = await getUserIp();
        const { data, error } = await supabase
            .from('Users')
            .select('Date')
            .eq('ip', ip)
        if (data.length > 0) {
            const lastUpdatedTime = new Date(data[0].Date);
            const diff = getCurrentTime.getTime() - lastUpdatedTime.getTime();
            const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
            if (diffDays > 1) {
                const { data, error } = await supabase
                    .from('Users')
                    .update({ queriesLeft: 10, Date: new Date() })
                    .eq('ip', ip)

            }
        }
    }

    const initialCheck = async () => {
        // get user IP Address
        const ip = await getUserIp();
        if (ip !== 'error') {
            userIp = ip;
            // check if user ip is in database
            const { data, error } = await supabase
                .from('Users')
                .select('ip, queriesLeft')
                .eq('ip', ip)
            if (data.length > 0) {
                setTotalQueriesLeft(data[0].queriesLeft);
            } else {
                // if not, add user ip to database
                const { data, error } = await supabase
                    .from('Users')
                    .insert([
                        { ip: ip, queriesLeft: 10, Date: new Date() },
                    ])
                setTotalQueriesLeft(10);
            }
        }
    }
    useEffect(() => {
        initialCheck();
        resetQueryLimit();
    }, [])

    const handleClick = async () => {
        var image_url = '';
        setIsLoading(true);
        setResultFetched(false);
        const response = await openai.createImage({
            prompt: `${input}}`,
            n: 1,
            size: "1024x1024",
        });
        if (response.status == 200) {
            setIsLoading(false);
            setResultFetched(true);
            image_url = response.data.data[0].url;
            setImageUrl(image_url);
            const ip = await getUserIp();
            const { data, error } = await supabase
                .from('Users')
                .update({ queriesLeft: totalQueriesLeft - 1 })
                .eq('ip', ip)
            setTotalQueriesLeft(totalQueriesLeft - 1);
        }
    }
    return (
        <div className="App">
            <div className="flex flex-col parent min-h-screen min-w-screen">
                <div className='flex flex-col items-center lg:items-start md:flex-row md:px-60 py-12 justify-between w-full'>
                    {Header()}
                    {Menu()}
                </div>
                {TextGeneration(totalQueriesLeft, onChange, handleClick)}
                {isLoading ? Loading() : resultFetched ? gptResponse(image_url) : null}
            </div>
        </div>
    );
}

export default Image
function gptResponse(image_url) {
    return <div className='flex flex-col w-full items-center justify-center mb-24'>
        <h1 className='relative inset-y-11 text-white gptBox px-3 py-2 rounded-full font-bold'>GPTIFY RESPONSE</h1>
        <div className='flex flex-col w-11/12 md:w-7/12 mt-6 md:px-12 py-8 generationBox p-5'>
            <img className='rounded-lg mt-3' src={image_url} />
        </div>
    </div>;
}

function TextGeneration(totalQueriesLeft, onChange, handleClick) {
    return <div className='flex flex-col w-full mt-24 gap-y-8 md:gap-y-16 justify-center items-center px-5 animate__animated animate__fadeInDown'>
        <h1 className='md:text-6xl text-2xl font-bold text-white text-center'>Image Generation</h1>
        <div className='flex w-full flex-row md:w-7/12 rounded-full searchBox py-5 lg:py-9 px-2 items-center'>
            <input onChange={onChange} className='w-full placeholder:truncate placeholder:text-[1rem] md:placeholder:text-lg bg-transparent rounded-full px-3 md:px-4 lg:px-8 text-white font-display text-xl focus:outline-none placeholder:text-s' placeholder='An old owl wandering in forest' />
            <p className='w-2/12 lg:w-1/12 font-display text-white/70 text-sm md:text-lg font-light'>{totalQueriesLeft} left</p>
        </div>
        <button onClick={handleClick} className={`inline-flex w-2/3 md:w-2/6 lg:w-1/6 items-center justify-center btnPrimary ${animationClass} font-display text-lg py-4 md:py-6 gap-x-2 text-white/80 mb-12`}>Generate <BsArrowRight /></button>
    </div>;
}
function Menu() {
    return <div className='flex flex-row items-center space-x-10 mt-12 md:mt-0'>
        <Link to={'/text'} className='text-white font-display text-lg cursor-pointer hover:text-white/80'>Text</Link>
        <Link to={'/image'} className='text-white font-display text-lg cursor-pointer hover:text-white/80'>Image</Link>
        <Link to={'/answer'} className='text-white font-display text-lg cursor-pointer hover:text-white/80'>Answer</Link>
    </div>;
}

function Header() {
    return <div className='flex flex-row items-center space-x-3'>
        <Link to={'/'} className='text-white font-bold text-3xl'>GPTIFY</Link>
        <h1 className='text-black text-sm bg-white px-2 rounded-full'>BETA</h1>
    </div>;
}

function Loading() {
    return (
        <div className="flex flex-row items-center justify-center mt-12 mb-12">
            <div className="la-ball-clip-rotate">
                <div></div>
            </div>
        </div>
    );
}