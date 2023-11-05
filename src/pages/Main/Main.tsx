import { useEffect, useState } from 'react'
import axios from 'axios'
import './Main.css'
import { City } from '@/types/covidData'

const Main = () => {
const [totalConfirmed, setTotalConfirmed] = useState<number>(0)
const [cityCovidData,setCityCovidData] = useState<City[]>([])
const [city,setCity] = useState<string | null>(null)
const [totalDeath,setTotalDeath]= useState<number>(0)

const clickCityName = (value:string) => {
    setCity(value)
}


useEffect(()=>{
    const fetchCityCovidData = async () => {
        let url = `http://apis.data.go.kr/1352000/ODMS_COVID_04/callCovid04Api?serviceKey=DpuTpEYsEJh8hrpKo4Bgvxv%2F0M0Yni%2F1GZ%2BA9FzWexYLll17xqLnDETxSUFTVsH29VC8uZt%2FfhPEEEYvPUuGFw%3D%3D&apiType=JSON`;

        if(!city){
            url += `&numOfRows=5&pageNo=1`
            try{
                const response = await axios.get(url)
                setTotalConfirmed(response.data.totalCount)
            }catch(error){
                console.log('에러',error)
            }
        }

        if(city){
            url += `&gubun=${city}`;
            try {
                const response = await axios.get(url)
                const {items} = response.data
                setCityCovidData(items.sort((a:City,b:City)=> parseInt(b.deathCnt)-parseInt(a.deathCnt)))
                setTotalDeath(items.sort((a:City,b:City)=> parseInt(b.deathCnt)-parseInt(a.deathCnt))[0].deathCnt)
            }catch(error){
                console.log('에러',error)
            }
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
                    <span className="confirmed-total">{totalConfirmed}</span>
                </div>
                <div className="country-ranks">
                    <p>Confirmed Cases by City</p>
                    <ol className="rank-list">
                        {cityList.map(item=>(
                        <li className="city-list" onClick={() => clickCityName(item)}>
                            {item}
                        </li>
                    ))}
                    </ol>
                </div>
                <p className="last-updated-time flex justify-center align-center"></p>
            </div>
            <div className="right-panel">
                <div className="summary-wrapper flex">
                    <div className="deaths-container">
                        <h3 className="summary-title">Total Deaths</h3>
                        <p className="total deaths">{totalDeath}</p>
                        <div className="list-wrapper">
                            <ol className="deaths-list">
                            {city && cityCovidData?.map(item=>(
                                    <li className="list-display">
                                        <span>
                                        {item.stdDay}
                                        {item.gubun}
                                        </span>
                                        <span>
                                        {item.deathCnt}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                    <div className="recovered-container">
                        <h3 className="summary-title">Total Recovered</h3>
                        <p className="total recovered">0</p>
                        <div className="list-wrapper">
                            <ol className="recovered-list">
                                {city && cityCovidData?.map(item=>(
                                    <li className="list-display">
                                        <span>
                                        {item.stdDay}
                                        {item.gubun}
                                        </span>
                                        <span>
                                        {item.isolClearCnt}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
                {/* <div className="chart-container">
                <canvas
                    id="lineChart"
                    className="corona-chart"
                    style="width: 100%; height: 356px; background-color: #5b5656;"
                ></canvas>
                </div> */}
            </div>
        </main>
    </>
)
}

export default Main

const cityList = ["서울","경기","경남","경북","울산","인천","대구","대전","전남","전북","광주","충북","충남","강원","세종","부산","제주"]