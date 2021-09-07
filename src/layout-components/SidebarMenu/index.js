/* eslint-disable */
import React, { useState, useEffect } from 'react';

import clsx from 'clsx';

import { Collapse, Alert } from 'reactstrap';

import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';

import { NavLink } from 'react-router-dom';
import { setSidebarToggleMobile } from '../../redux/reducers/ThemeOptions';
import jwt from  'jsonwebtoken'
import auth from 'config/auth';
import localforage from 'config/localForage';

import {
  ChevronRight,
  Shield,
  Database,
  Calendar,
  PieChart,
  Clipboard,
  Settings,
  Layout,
  List,
  CheckSquare,
  Briefcase,
  DollarSign
} from 'react-feather';
import Sidebar from 'layout-components/Sidebar';

const SidebarMenu = (props) => {
  const { setSidebarToggleMobile, sidebarUserbox } = props;

  const toggleSidebarMobile = () => setSidebarToggleMobile(false);

  const [masterOpen, setMasterOpen] = useState(false);
  const [laporanOpen, setLaporanOpen] = useState(false);  
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  const toggleMaster = (event) => {
    setMasterOpen(!masterOpen);
    event.preventDefault();
  };

  const toggleLaporan = (event) => {
    setLaporanOpen(!laporanOpen);
    event.preventDefault();
  };

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      setMounted(true);
      let cekUser = await auth();
      console.log(cekUser)
      if(cekUser.status){
        setUser(cekUser.data)
      }
      else{
        console.log(cekUser.msg)
      }      
      // const value = await localforage.getItem('gerai');
      // setUser(value);
      // This code runs once the value has been loaded
      // from the offline store.
      // console.log("user private", value);
    } catch (err) {
      // This code runs if there were any errors.
      console.log(err);
    }
    // try {
    //   const value = await localforage.getItem('user');
    //   // This code runs once the value has been loaded
    //   // from the offline store.
    //   // console.log("user private", value);
    //   setUser(value);
    //   setMounted(true);
    // } catch (err) {
    //   // This code runs if there were any errors.
    //   console.log(err);
    // }
  };

  return (
    <>
      <PerfectScrollbar>
        {/* {sidebarUserbox && <SidebarUserbox />} */}
        <div className="sidebar-navigation">
          {/* <div className="sidebar-header">
            <span>Navigation menu</span>
          </div> */}
          {(user && user.tu != 'Psikotes') &&
            <ul>
              <li>
                <NavLink
                  activeClassName="active"
                  onClick={toggleSidebarMobile}
                  className="nav-link-simple"
                  to="/dashboard">
                  <span className="sidebar-icon">
                    <Shield />
                  </span>
                Dashboard
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                    <ChevronRight />
                  </span>
                </NavLink>
              </li>
              <li>
                <a
                  href="#/"
                  onClick={toggleMaster}
                  className={clsx({ active: masterOpen })}>
                  <span className="sidebar-icon">
                    <Database />
                  </span>
                  <span className="sidebar-item-label">Master</span>
                  <span className="sidebar-icon-indicator">
                    <ChevronRight />
                  </span>
                </a>
                <Collapse isOpen={masterOpen}>
                  <ul>
                    <li>
                      <NavLink
                        onClick={toggleSidebarMobile}
                        to="/master/gerai">
                        Gerai
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={toggleSidebarMobile}
                        to="/master/customer">
                        Customer
                      </NavLink>
                    </li>                  
                  </ul>
                </Collapse>
              </li>
              <li>
                <NavLink
                  activeClassName="active"
                  onClick={toggleSidebarMobile}
                  className="nav-link-simple"
                  to="/subscription">
                  <span className="sidebar-icon">
                    <Calendar />
                  </span>
                  Subscription
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                    <ChevronRight />
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  activeClassName="active"
                  onClick={toggleSidebarMobile}
                  className="nav-link-simple"
                  to="/withdraw">
                  <span className="sidebar-icon">
                    <DollarSign />
                  </span>
                  Withdrawal
                  <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                    <ChevronRight/>
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  activeClassName="active"
                  onClick={toggleSidebarMobile}
                  className="nav-link-simple"
                  to="/laporan/gerai">
                  <span className="sidebar-icon">
                    <PieChart />
                  </span>
                  Laporan
                  <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                    <ChevronRight/>
                  </span>
                </NavLink>
                {/* <a
                  href="#/"
                  onClick={toggleLaporan}
                  className={clsx({ active: laporanOpen })}>
                  <span className="sidebar-icon">
                    <PieChart/>
                  </span>
                  <span className="sidebar-item-label">Laporan</span>
                  <span className="sidebar-icon-indicator">
                    <ChevronRight/>
                  </span>
                </a>
                <Collapse isOpen={laporanOpen}>
                  <ul>
                    <li>
                      <NavLink
                        onClick={toggleSidebarMobile}
                        to="/laporan/gerai">
                        Gerai
                      </NavLink>
                    </li>                    
                  </ul>
                </Collapse> */}
              </li>
            </ul>
          }
        </div>
      </PerfectScrollbar>
    </>
  );
};

const mapStateToProps = (state) => ({
  sidebarUserbox: state.ThemeOptions.sidebarUserbox,
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile
});

const mapDispatchToProps = (dispatch) => ({
  setSidebarToggleMobile: (enable) => dispatch(setSidebarToggleMobile(enable))
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarMenu);
// export default SidebarMenu;
