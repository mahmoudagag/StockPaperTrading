import { quantum } from 'ldrs'

quantum.register()

export default function Loading({errorMessage}){
    return(
        <div className='mt-40 flex items-center justify-center '>
            <div className="block">
                <l-quantum
                size="90"
                speed="1.75" 
                color="white" 
                ></l-quantum>
                <div className='text-tremor-default text-tremor-content dark:text-dark-tremor-content text-center mt-5'>{errorMessage}</div>
            </div>
        </div>
    )
}