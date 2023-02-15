import React, { useEffect, useRef } from 'react'
import '../App.css';
import { BsArrowRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js'
import { useLocation } from 'react-router'

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const supabaseUrl = 'https://bdnoqibfmwidzipxlilt.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const animationClass = 'transition duration-500 ease-in-out hover:scale-110 hover:translate-y-1'

function LongText() {
    var userIp = '';
    const [text, setText] = React.useState('No Response Generated Yet');
    const [input, setInput] = React.useState('');
    const [resultFetched, setResultFetched] = React.useState(false);
    const [totalQueriesLeft, setTotalQueriesLeft] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingUser, setIsLoadingUser] = React.useState(false);

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
        setIsLoadingUser(true);
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
        setIsLoadingUser(false);
    }

    useEffect(() => {
        initialCheck();
        resetQueryLimit();
    }, [])

    const handleClick = async () => {
        setIsLoading(true);
        setResultFetched(false);
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${input}`,
            temperature: 0.5,
            max_tokens: 700,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });
        if (response.status == 200) {
            setIsLoading(false);
            setResultFetched(true);
            setText(response.data.choices[0].text);
        }
        const ip = await getUserIp();
        const { data, error } = await supabase
            .from('Users')
            .update({ queriesLeft: totalQueriesLeft - 1 })
            .eq('ip', ip)
        setTotalQueriesLeft(totalQueriesLeft - 1);
    }
    return (
        <div className="App">
            <div className="flex flex-col parent min-h-screen min-w-screen">
                <div className='flex flex-col items-center lg:items-start md:flex-row md:px-60 py-12 justify-between w-full'>
                    {Header()}
                    {Menu()}
                </div>
                {TextGeneration(totalQueriesLeft, handleClick, onChange)}
                {isLoadingUser ? Loading() : null}
                {isLoading ? Loading() : resultFetched ? gptResponse(text) : null}
            </div>
        </div>
    );
}

export default LongText

function gptResponse(text) {
    return <div className='flex flex-col w-full items-center justify-center mb-24'>
        <h1 className='relative inset-y-11 text-white gptBox px-3 py-2 rounded-full font-bold'>GPTIFY RESPONSE</h1>
        <div className='flex flex-col w-11/12 md:w-7/12 mt-6 md:px-12 py-8 generationBox p-5'>
            <p className='font-display text-lg text-white/75 mt-3 text-left'>{text}</p>
        </div>
    </div>;
}

function TextGeneration(totalQueriesLeft, handleClick, onChange) {
    return <div className='flex flex-col w-full mt-24 gap-y-8 md:gap-y-16 justify-center items-center px-5 animate__animated animate__fadeInDown'>
        <h1 className='md:text-6xl text-2xl font-bold text-white text-center'>Long Text Generation</h1>
        <div className='flex w-full flex-row md:w-7/12 rounded-full searchBox py-5 lg:py-9 px-2 items-center'>
            <input onChange={onChange} className='w-full bg-transparent rounded-full px-3 md:px-4 lg:px-8 text-white font-display text-xl focus:outline-none placeholder:text-s placeholder:truncate placeholder:text-[1rem] md:placeholder:text-lg' placeholder='Search for a topic' />
            <p className='w-2/12 lg:w-1/12 font-display text-white/70 text-sm md:text-lg font-light'>{totalQueriesLeft} left</p>
        </div>
        {totalQueriesLeft > 0 ? <button onClick={handleClick} className={`inline-flex w-2/3 md:w-2/6 lg:w-1/6 items-center justify-center btnPrimary ${animationClass} font-display text-lg py-4 md:py-6 gap-x-2 text-white/80 mb-12`}>Generate <BsArrowRight /></button> : null}
    </div>;
}

function Menu() {
    return <div className='flex flex-row items-center space-x-7 mt-12 md:mt-0'>
        <Link to={'/text'} className='text-white font-display text-lg cursor-pointer hover:text-white/80 border-b-2 border-white hover:border-white/80 pb-1'>Text</Link>
        <Link to={'/longtext'} className='text-white font-display text-lg cursor-pointer hover:text-white/80 border-b-2 border-white hover:border-white/80 pb-1'>Long Text</Link>
        <Link to={'/image'} className='text-white font-display text-lg cursor-pointer hover:text-white/80 border-b-2 border-white hover:border-white/80 pb-1'>Image</Link>
        <Link to={'/answer'} className='text-white font-display text-lg cursor-pointer hover:text-white/80 border-b-2 border-white hover:border-white/80 pb-1'>Answer</Link>
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
        <div className="flex flex-row items-center justify-center mt-12">
            <div className="la-ball-clip-rotate">
                <div></div>
            </div>
        </div>
    );
}