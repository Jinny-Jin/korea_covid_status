import { useEffect, useState } from 'react'
import axios from 'axios'
import {Line} from 'react-chartjs-2'
import {Chart as ChartJS,CategoryScale, LineElement,LinearScale, PointElement} from "chart.js"
import './Main.css'
import { City } from '@/types/covidData'
ChartJS.register(CategoryScale,LineElement,LinearScale,PointElement)

const Main = () => {
const [totalCovidData, setTotalCovidData] = useState<City[]>([])
const [cityCovidData,setCityCovidData] = useState<City[] | null>(null)
const [city,setCity] = useState<string | null>(null)
const [totlaRecovered,setTotalRecovered] = useState<number>(0)
const [totalConfirmed, setTotalConfirmed] = useState<number>(0)

const slicedCovidData = cityCovidData?.slice(0,15)

const data = {
    labels : slicedCovidData?.map(item => item.stdDay),
    datasets : [
        {
            data : slicedCovidData?.map(item => item.defCnt),
            borderColor : "red",
            backgroundColor : "yellow",
            borderWidth : 1
        }
    ]
}

const clickCityName = (value:string) => {
    setCity(value)
}

useEffect(()=>{

    const fetchCityCovidData = async () : Promise<void> => {
        let url = `http://apis.data.go.kr/1352000/ODMS_COVID_04/callCovid04Api?serviceKey=DpuTpEYsEJh8hrpKo4Bgvxv%2F0M0Yni%2F1GZ%2BA9FzWexYLll17xqLnDETxSUFTVsH29VC8uZt%2FfhPEEEYvPUuGFw%3D%3D&apiType=JSON`;

        if(!city){
            url += "&std_Day=2023-08-30"
        }else{
            url += `&gubun=${city}`;
        }
        try{
            const response = await axios.get(url)
            const {items} = response.data

            if(!city){
                setTotalCovidData(items)
                setTotalConfirmed(items?.filter((item : City)=> item.gubun === "합계")[0].defCnt)
            }else{
                setTotalRecovered(items?.sort((a:City,b:City)=> parseInt(b.isolClearCnt)-parseInt(a.isolClearCnt))[0].isolClearCnt)
                setCityCovidData(items?.sort((a:City,b:City)=> {
                    if(parseInt(b.deathCnt) !== parseInt(a.deathCnt)){
                        return parseInt(b.deathCnt) - parseInt(a.deathCnt)
                    }else {
                        return b.stdDay > a.stdDay ? 1 : -1
                    }
                }))
            }

        }catch(error){
            console.log('에러',error)
        }
    }

    fetchCityCovidData()
},[city])


return (
    <>
        <header className="flex justify-center">
            <h1>코로나 한국 현황판</h1>
        </header>
        <main className="flex">
            <div className="left-panel flex column">
                <div className="total-board">
                    <p>Total Confirmed</p>
                    <span className="confirmed-total">
                        {totalConfirmed}
                    </span>
                </div>
                <div className="country-ranks">
                    <p>Confirmed Cases by City</p>
                    <ol className="rank-list">
                        {totalCovidData?.map((item : City)=>(
                            item.gubun !== "합계" && item.gubun !== "검역" && (
                                <li className={`city-list flex ${city === item.gubun ? "selected" : ""}`} onClick={()=> clickCityName(item.gubun)}>
                                    <span className="city-def">
                                    {item.defCnt}
                                    </span>
                                    {item.gubun}
                                </li>
                            )
                    ))}
                    </ol>
                </div>
                <p className="last-updated-time flex justify-center align-center"></p>
            </div>
            <div className="right-panel">
                <div className="summary-wrapper flex">
                    <div className="deaths-container">
                        <h3 className="summary-title">Total Deaths</h3>
                        <p className="total deaths">{cityCovidData? cityCovidData[0]?.deathCnt : 0}</p>
                        <div className="list-wrapper">
                            <ol className="right-list">
                                {city && cityCovidData?.map(item=>(
                                    <li className="list-display">
                                        <span className='date-city'>
                                            <span className='date'>
                                                {item.stdDay}
                                            </span>
                                            {item.gubun}
                                        </span>
                                        {item.deathCnt}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                    <div className="recovered-container">
                        <h3 className="summary-title">Total Recovered</h3>
                        <p className="total recovered">{totlaRecovered}</p>
                        <div className="list-wrapper">
                            <ol className="right-list">
                                {city && cityCovidData?.map(item=>(
                                    <li className="list-display">
                                        <span className='date-city'>
                                            <span className='date'>
                                                {item.stdDay}
                                            </span>
                                            {item.gubun}
                                        </span>
                                        {item.isolClearCnt}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
                <div className="chart-container">
                    <Line data={data} />
                </div>
            </div>
        </main>
    </>
)
}

export default Main
