import logo from '../assets/icon/logoHeader.png';

const HeaderDashboard = () => {
    return(
        <header className="headerDash">
        <div className='headerDashName'>
            <h1>LogiSmart</h1>
            <img src={logo} alt="Logo Logisoins" className='logo' />
        </div>
        <div id="softwareVersion">
        <p>Version 1.0</p>
        </div>
        </header>
    )
}

export default HeaderDashboard;