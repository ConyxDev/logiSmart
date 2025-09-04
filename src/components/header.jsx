import logo from '../assets/icon/logoHeader.png';

const Header = () => {
    return(
        <header className="header">
        <div className='headerName'>
            <h1>LogiCore</h1>
            <img src={logo} alt="Logo LogiCore" className='logo' />
            
        </div>
        <div id="softwareVersion">
        <p>Version 1.0</p>
        </div>
        </header>
    )
}

export default Header;