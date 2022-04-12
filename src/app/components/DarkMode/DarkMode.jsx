import React from "react";
import moondark from './moon.png';
import moonlight from './moon_light.png';
const DarkMode = () => {
    let clickedClass = "clicked"
    const body = document.body
    const lightTheme = "theme-buidl-light"
    const darkTheme = "theme-buidl-dark"
    let theme
    //fetch data
    const ip = '133.636.23.90' ;

    if (localStorage) {
      theme = localStorage.getItem("theme")
    }

    if (theme === lightTheme || theme === darkTheme) {
      body.classList.add(theme)
    } else {
      body.classList.add(lightTheme)
    }

    const switchTheme = e => {
      if (theme === darkTheme) {
        body.classList.replace(darkTheme, lightTheme)
        e.target.classList.remove(clickedClass)
        e.target.src=moondark
        localStorage.setItem("theme", "theme-buidl-light")
        theme = lightTheme
      } else {
        body.classList.replace(lightTheme, darkTheme)
        e.target.classList.add(clickedClass)
        e.target.src=moonlight
        localStorage.setItem("theme", "theme-buidl-dark")
        theme = darkTheme
      }



      //END OF THE SWITCH THEME
    }

    return (
    <div style={{marginLeft: '20px'}}>
        <button
        id="darkMode"
        style={{cursor: 'pointer'}}
        onClick={e => switchTheme(e)}
      > <div id="moon" ><img src={localStorage.getItem('theme') === darkTheme ? moonlight : moondark} alt="moonlight" width='40px' style={{marginLeft: '10px'}} /></div></button>
      </div>
    )
  }

  export default DarkMode;
