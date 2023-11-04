import { useEffect, useState } from 'react'
import axios from 'axios'
import './Main.css'

const Main = () => {
const [totalConfirmed, setTotalConfirmed] = useState(0)
const [cityCovidData,setCityCovidData] = useState([])
const [city,setCity] = useState(null)
const [totalDeath, setTotalDeath] = useState(0)


const clickCityName = (value) => {
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
                setCityCovidData(response.data.items.sort((a,b)=> parseInt(b.deathCnt)-parseInt(a.deathCnt)))
            }catch(error){
                console.log('에러',error)
            }
        }
    }

    fetchCityCovidData()
},[city])


// useEffect(()=>{
//     const sortingTotalDeath = () => {
//         if(city && cityCovidData){
//             const sortedData = cityCovidData.sort((a,b)=> parseInt(b.deathCnt) - parseInt(a.deathCnt))
//             setCityCovidData(sortedData)
//         }    
//     }

//     sortingTotalDeath()
// },[cityCovidData,fetchCityCovidData])

return (
    <>
        <header class="flex justify-center">
            <h1>코로나 한국 현황판</h1>
        </header>
        <main class="flex">
            <div class="left-panel flex column">
                <div class="total-board">
                    <p>Total Confirmed</p>
                    <span class="confirmed-total">{totalConfirmed}</span>
                </div>
                <div class="country-ranks">
                    <p>Confirmed Cases by City</p>
                    <ol class="rank-list">
                        {cityList.map(item=>(
                        <li class="city-list" onClick={() => clickCityName(item)}>
                            {item}
                        </li>
                    ))}
                    </ol>
                </div>
                <p class="last-updated-time flex justify-center align-center"></p>
            </div>
            <div class="right-panel">
                <div class="summary-wrapper flex">
                    <div class="deaths-container">
                        <h3 class="summary-title">Total Deaths</h3>
                        <p class="total deaths">{totalDeath}</p>
                        <div class="list-wrapper">
                            <ol class="deaths-list">
                            {city && cityCovidData?.map(item=>(
                                    <li>
                                        {item.stdDay}
                                        {item.gubun}
                                        {item.deathCnt}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                    <div class="recovered-container">
                        <h3 class="summary-title">Total Recovered</h3>
                        <p class="total recovered">0</p>
                        <div class="list-wrapper">
                            <ol class="recovered-list">
                                {city && cityCovidData?.map(item=>(
                                    <li>
                                        {item.stdDay}
                                        {item.gubun}
                                        {item.isolClearCnt}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
                {/* <div class="chart-container">
                <canvas
                    id="lineChart"
                    class="corona-chart"
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