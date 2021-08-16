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
  const [masterPsikotesOpen, setMasterPsikotesOpen] = useState(false);
  const [masterUjianOpen, setMasterUjianOpen] = useState(false);
  const [staticOpen, setStatic] = useState(false);
  const [level2Open, setLevel2Open] = useState(false);
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const toggleMaster = (event) => {
    setMasterOpen(!masterOpen);
    event.preventDefault();
  };
  const toggleMasterPsikotes = (event) => {
    setMasterPsikotesOpen(!masterPsikotesOpen);
    event.preventDefault();
  };
  const toggleMasterUjian = (event) => {
    setMasterUjianOpen(!masterUjianOpen);
    event.preventDefault();
  };
  const toggleStatic = (event) => {
    setStatic(!staticOpen);
    event.preventDefault();
  };
  const toggleLevel2 = (event) => {
    setLevel2Open(!level2Open);
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
                    {/* <li>
                      <NavLink
                        onClick={toggleSidebarMobile}
                        to="/master/menu">
                        Menu
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={toggleSidebarMobile}
                        to="/master/task">
                        Task
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={toggleSidebarMobile}
                        to="/master/voucher">
                        Voucher
                      </NavLink>
                    </li> */}
                    {/* <li>
                      <NavLink
                        onClick={toggleSidebarMobile}
                        to="/master/user/list">
                        User
                    </NavLink>
                    </li>                    
                    <li>
                      <NavLink
                        onClick={toggleSidebarMobile}
                        to="/master/pendaftaran">
                        Pendaftaran
                    </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={toggleSidebarMobile}
                        to="/master/period">
                        Periode
                    </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={toggleSidebarMobile}
                        to="/master/school">
                        School
                    </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={toggleSidebarMobile}
                        to="/master/syarat">
                        Syarat Administrasi
                    </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={toggleSidebarMobile}
                        to="/master/file">
                        File Download
                    </NavLink>
                    </li> */}
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
              {/* <li>
                <div className="d-sm-block text-white py-2 mx-2 border-bottom border-dark">
                    <div className="d-sm-block mx-2">Tahap II Administrasi</div>
                </div>
              </li>
              <li>
                <NavLink
                  activeClassName="active"
                  onClick={toggleSidebarMobile}
                  className="nav-link-simple"
                  to="/tahap2">
                  <span className="sidebar-icon">
                    <Shield />
                  </span>
                Administrasi
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                    <ChevronRight />
                  </span>
                </NavLink>
              </li>
              <li>
                <div className="d-sm-block text-white py-2 mx-2 border-bottom border-dark">
                    <div className="d-sm-block mx-2">Tahap III Ujian</div>
                </div>
              </li>              
              <li>
                <a
                  href="#/"
                  onClick={toggleMasterUjian}
                  className={clsx({ active: masterUjianOpen })}>
                  <span className="sidebar-icon">
                    <Clipboard />
                  </span>
                  <span className="sidebar-item-label">Master Ujian</span>
                  <span className="sidebar-icon-indicator">
                    <ChevronRight />
                  </span>
                </a>
                <Collapse isOpen={masterUjianOpen}>
                  <ul>
                    <li>
                      <NavLink
                        onClick={toggleSidebarMobile}
                        to="/master/ujian/kategori">
                        Kategori Ujian
                    </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={toggleSidebarMobile}
                        to="/master/ujian/soal">
                        Soal Ujian
                    </NavLink>
                    </li>
                  </ul>
                </Collapse>
              </li>
              <li> */}
                {/* <NavLink
                  activeClassName="active"
                  onClick={toggleSidebarMobile}
                  className="nav-link-simple"
                  to="/master/ujian/setting">
                  <span className="sidebar-icon">
                    <Settings />
                  </span>
                Ujian Setting
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                    <ChevronRight />
                  </span>
                </NavLink>
              </li> */}
              {/* <li>
                <NavLink
                  activeClassName="active"
                  onClick={toggleSidebarMobile}
                  className="nav-link-simple"
                  to="/tahap2">
                  <span className="sidebar-icon">
                    <Shield />
                  </span>
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                  <ChevronRight />
                </span> 
              </NavLink>
              </li> */}
              {/* <li>
                <NavLink
                  activeClassName="active"
                  onClick={toggleSidebarMobile}
                  className="nav-link-simple"
                  to="/master/ujian/hasil">
                  <span className="sidebar-icon">
                    <CheckSquare />
                  </span>
                Hasil Ujian
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                    <ChevronRight />
                  </span>
                </NavLink>
              </li>
              <li>
                <a
                  href="#/"
                  onClick={toggleMasterPsikotes}
                  className={clsx({ active: masterPsikotesOpen })}>
                  <span className="sidebar-icon">
                    <Clipboard />
                  </span>
                  <span className="sidebar-item-label">Master Psikotes</span>
                  <span className="sidebar-icon-indicator">
                    <ChevronRight />
                  </span>
                </a>
                <Collapse isOpen={masterPsikotesOpen}>
                  <ul>
                    <li>
                      <NavLink
                        onClick={toggleSidebarMobile}
                        to="/master/userpsikotes/list">
                        User Psikotes
                    </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={toggleSidebarMobile}
                        to="/psikotes/export">
                        Export Data Peserta Psikotes
                    </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={toggleSidebarMobile}
                        to="/master/aspekpsikotes/list">
                        Master Aspek
                    </NavLink>
                    </li>
                  </ul>
                </Collapse>
              </li>
              <li> */}
                {/* <NavLink
                  activeClassName="active"
                  onClick={toggleSidebarMobile}
                  className="nav-link-simple"
                  to="/psikotes">
                  <span className="sidebar-icon">
                    <List />
                  </span>
                Daftar ujian Psikotes
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                    <ChevronRight />
                  </span>
                </NavLink>
              </li> */}
              {/* <li>
              <NavLink
                activeClassName="active"
                onClick={toggleSidebarMobile}
                className="nav-link-simple"
                to="/master/ujian/request">
                <span className="sidebar-icon">
                  <Clipboard />
                </span>
                Request Ujian
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                  <ChevronRight />
                </span> 
              </NavLink>
            </li> */}
             {/* <li>
                <div className="d-sm-block text-white py-2 mx-2 border-bottom border-dark">
                    <div className="d-sm-block mx-2">Tahap IV Unggah Berkas</div>
                </div>
              </li>
              <li>
                <NavLink
                  activeClassName="active"
                  onClick={toggleSidebarMobile}
                  className="nav-link-simple"
                  to="/tahap4">
                  <span className="sidebar-icon">
                    <Briefcase />
                  </span>
                Unggah Berkas
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                    <ChevronRight />
                  </span>
                </NavLink>
              </li>
            <li>
                <div className="d-sm-block text-white py-2 mx-2 border-bottom border-dark">
                    <div className="d-sm-block mx-2">Statis</div>
                </div>
              </li>
              <li>
                <a
                  href="#/"
                  onClick={toggleStatic}
                  className={clsx({ active: staticOpen })}>
                  <span className="sidebar-icon">
                    <Layout />
                  </span>
                  <span className="sidebar-item-label">Statis</span>
                  <span className="sidebar-icon-indicator">
                    <ChevronRight />
                  </span>
                </a>
                <Collapse isOpen={staticOpen}>
                  <ul>
                    <li>
                      <NavLink
                        onClick={toggleSidebarMobile}
                        to="/static/timeline">
                        Timeline
                    </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={toggleSidebarMobile}
                        to="/static/tatib">
                        Tata Tertib Ujian
                    </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={toggleSidebarMobile}
                        to="/static/alamatdokumen">
                        Alamat Pengiriman Dokumen
                    </NavLink>
                    </li>
                  </ul>
                </Collapse>
              </li> */}
            </ul>
          }
          {/* {(user && user.tu == 'Psikotes') &&
            <ul>
              <li>
                <NavLink
                  activeClassName="active"
                  onClick={toggleSidebarMobile}
                  className="nav-link-simple"
                  to="/psikotes">
                  <span className="sidebar-icon">
                    <List />
                  </span>
                Daftar Psikotes
                <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                    <ChevronRight />
                  </span>
                </NavLink>
              </li>
            </ul>
          } */}
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
