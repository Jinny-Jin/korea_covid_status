import { useEffect, useState } from 'react'
import {Line} from 'react-chartjs-2'
import {Chart as ChartJS,CategoryScale, LineElement,LinearScale, PointElement,Tooltip} from "chart.js"
import axios from 'axios'
import { City } from '@/types/covidData'
import './Main.css'
ChartJS.register(CategoryScale,LineElement,LinearScale,PointElement,Tooltip)

const Main = () => {

const [totalCovidData, setTotalCovidData] = useState<City[]>([])
const [cityCovidData,setCityCovidData] = useState<City[] | null>(null)
const [city,setCity] = useState<string | null>(null)

const totalConfirmed = totalCovidData?.find(item => item.gubun === "합계")?.defCnt || 0
const totalRecovered = cityCovidData?.reduce((max,item) => {
    const current = parseInt(item.isolClearCnt)
    return current > max ? current : max
},0) || 0

const clickCityName = (value:string) => {
    setCity(value)
}

const slicedCovidData = cityCovidData?.filter((item,index,self)=> {
    return index === self.findIndex((t)=> t.stdDay === item.stdDay)
})
.sort((a,b) => parseInt(b.defCnt) - parseInt(a.defCnt))
.slice(0,15)

const data = {
    labels : slicedCovidData?.map(item => item.stdDay).reverse(),
    datasets : [
        {
            data : slicedCovidData?.map(item => item.defCnt).reverse(),
            borderColor : "red",
            backgroundColor : "pink",
            borderWidth : 1
        }
    ]
}

const options = {
    responsive : true,
    maintainAspectRatio: false, 
    aspectRatio: 2,
    plugins : {
        tooltip : {
            mode : "index" as const,
            intersect : false
        }
    }
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
                setCity(items[0]?.gubun)
            }else{
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
                <p className="last-updated-time flex justify-center align-center">
                    {totalCovidData[0]?.stdDay}
                </p>
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
                        <p className="total recovered">{totalRecovered}</p>
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
                    <Line data={data} options={options}/>
                </div>
            </div>
        </main>
    </>
)
}

export default Main
