import React, { lazy, Suspense, useState, useEffect, useCallback } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ClimbingBoxLoader } from 'react-spinners';
import PrivateRoute from './components/privateroute';
import localforage from 'config/localForage';
import { connect } from 'react-redux';
import { setProfilePicture } from './redux/reducers/General';
import auth from 'config/auth';
import jwt  from 'jsonwebtoken';
// Layout Blueprints

import { LeftSidebar, MinimalLayout } from './layout-blueprints';

// Example Pages

import PageError404 from './pages/PageError404';
import PageAbout from './pages/PageAbout';

const DashboardStatistics = lazy(() => import('./pages/DashboardStatistics'));
const PageLoginPsikotes = lazy(() => import('./pages/PagePsikotesLogin'));
const PageLoginBasic = lazy(() => import('./pages/PageLoginBasic'));
const PageRegister = lazy(() => import('./components/PageRegister'))
const PageRecoverBasic = lazy(() => import('./pages/PageRecoverBasic'));
const UserList = lazy(() => import('./pages/Master/User'));
const UserEdit = lazy(() => import('./pages/Master/User/edit'));
const UserPsikotesList = lazy(() => import('./pages/MasterPsikotes/UserPsikotes'));
const UserPsikotesEdit = lazy(() => import('./pages/MasterPsikotes/UserPsikotes/edit'));
const AspekPsikotes = lazy(() => import('./pages/MasterPsikotes/Aspek'));
const AspekPsikotesEdit = lazy(() => import('./pages/MasterPsikotes/Aspek/edit'));
const Period = lazy(() => import('./pages/Master/PeriodRegister'));
const PeriodCreate = lazy(() => import('./pages/Master/PeriodRegister/create'));
const PeriodEdit = lazy(() => import('./pages/Master/PeriodRegister/edit'));
const File = lazy(() => import('./pages/Master/FileDownload'));
const FileCreate = lazy(() => import('./pages/Master/FileDownload/create'));
const FileEdit = lazy(() => import('./pages/Master/FileDownload/edit'));
const Pendaftaran = lazy(() => import('./pages/Master/Pendaftaran'));
const PendaftaranEdit = lazy(() => import('./pages/Master/Pendaftaran/edit'));
const Pendaftar = lazy(() => import('./pages/Master/Pendaftar'));
const PendaftarEdit = lazy(() => import('./pages/Master/Pendaftar/edit'));
const School = lazy(() => import('./pages/Master/School'));
const SchoolEdit = lazy(() => import('./pages/Master/School/edit'));
const SchoolCreate = lazy(() => import('./pages/Master/School/create'));
const SchoolImport = lazy(() => import('./pages/Master/School/importExcel'));
const SyaratAdmin = lazy(() => import('./pages/Master/SyaratAdmin'));
const SyaratAdminEdit = lazy(() => import('./pages/Master/SyaratAdmin/edit'));
const Profile = lazy(() => import('./pages/Profile'));
const Withdraw = lazy(() => import('./pages/Withdraw/withdraw'));
const Tahap2 = lazy(() => import('./pages/Tahap2'));
const Tahap2Edit = lazy(() => import('./pages/Tahap2/edit'));
const Tahap2Req = lazy(() => import('./pages/Tahap2/requirement'));
const Tahap4 = lazy(() => import('./pages/Tahap4'));
const Tahap4Edit = lazy(() => import('./pages/Tahap4/edit'));
const Tahap4Req = lazy(() => import('./pages/Tahap4/requirement'));
const MenuList = lazy(() => import('./pages/Master/Menu'));
const MenuEdit = lazy(() => import('./pages/Master/Menu/edit'));
const GeraiList = lazy(() => import('./pages/Master/Gerai'));
const GeraiEdit = lazy(() => import('./pages/Master/Gerai/edit'));
const SubsList = lazy(() => import('./pages/Subscription'));
const SubsEdit = lazy(() => import('./pages/Subscription/edit'));
const TaskList = lazy(() => import('./pages/Master/Task'));
const TaskEdit = lazy(() => import('./pages/Master/Task/edit'));
const VoucherList = lazy(() => import('./pages/Master/Voucher'));
const VoucherEdit = lazy(() => import('./pages/Master/Voucher/edit'));
const KategoriUjian = lazy(() =>
  import('./pages/MasterUjian/KategoriUjian/index')
);
const KategoriUjianEdit = lazy(() =>
  import('./pages/MasterUjian/KategoriUjian/edit')
);
const Ujian = lazy(() => import('./pages/MasterUjian/index'));
const UjianEdit = lazy(() => import('./pages/MasterUjian/edit'));
const SoalUjian = lazy(() => import('./pages/MasterUjian/SoalUjian/index'));
const SoalUjianEdit = lazy(() => import('./pages/MasterUjian/SoalUjian/edit'));
const Timeline = lazy(() => import('./pages/Static/Timeline'));
const Tatib = lazy(() => import('./pages/Static/TataTertibUjian'));
const AlamatDokumen = lazy(() => import('./pages/Static/AlamatDokumen'));
const EditJawaban = lazy(() => import('./pages/MasterUjian/SoalUjian/editjawaban'));
const EditJurusan = lazy(() => import('./pages/MasterUjian/editjurusan'));
const Psikotes = lazy(() => import('./pages/Psikotes/index'));
// const PsikotesEdit = lazy(() => import('./pages/Psikotes/edit'));
// const PsikotesCreate = lazy(() => import('./pages/Psikotes/create'));
const PsikotesImport = lazy(() => import('./pages/Psikotes/importExcel'));
const PsikotesExport = lazy(() => import('./pages/Psikotes/exportExcel'));
const HasilUjian =  lazy(() => import('./pages/MasterUjian/HasilUjian'));
const DetailUjian =  lazy(() => import('./pages/MasterUjian/HasilUjian/detail'));
const FotoUjian =  lazy(() => import('./pages/MasterUjian/FotoUjian'));
// const JurusanUjian = lazy(()=> import('./pages/MasterUjian/JurusanUjian/index'));
// const JurusanUjianEdit = lazy(()=> import('./pages/MasterUjian/JurusanUjian/edit'));
// const JawabanUjian = lazy(()=> import('./pages/Master/Ujian/JawabanUjian/index'));
// const JawabanUjianEdit = lazy(()=> import('./pages/Master/Ujian/JawabanUjian/edit'));
const Routes = (props) => {
  const { setProfilePicture } = props;
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.99
    },
    in: {
      opacity: 1,
      scale: 1
    },
    out: {
      opacity: 0,
      scale: 1.01
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  const SuspenseLoading = () => {
    return (
      <>
        <div className="d-flex align-items-center flex-column vh-100 justify-content-center text-center py-3">
          <div className="d-flex align-items-center flex-column px-4">
            <ClimbingBoxLoader color={'#3c44b1'} loading={true} />
          </div>
          <div className="text-muted font-size-xl text-center pt-3">
            Loading
            {/* <span className="font-size-lg d-block text-dark">
              This live preview instance can be slower than a real production
              build!
            </span> */}
          </div>
        </div>
      </>
    );
  };

  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);  

  const getUser = useCallback(async () => {
    try {
      let cekUser = await auth();
      if (cekUser.status) {
        setUser(cekUser.data);
        // setProfilePicture(cekUser.data.foto_gerai);
      } else {
        console.log(cekUser.msg);
      }
      setMounted(true);
      // const value = await localforage.getItem('gerai');
      // setUser(value);
      // This code runs once the value has been loaded
      // from the offline store.
      // console.log("user private", value);
    } catch (err) {
      setMounted(false);
      // This code runs if there were any errors.
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (mounted) {
    return (
      <AnimatePresence>
        <Suspense fallback={<SuspenseLoading />}>
          <Switch>
            {!user && <Redirect exact from="/" to="/login" />}
            {!user && <Redirect exact from="/master" to="/login" />}
            {user && <Redirect exact from="/" to="/dashboard" />}
            {user && <Redirect exact from="/login" to="/dashboard" />}
            {/* <Route path={['/Overview']}>
              <PresentationLayout>
                <Switch location={location} key={location.pathname}>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}>
                    <Route path="/Overview" component={Overview} />
                  </motion.div>
                </Switch>
              </PresentationLayout>
            </Route> */}

            <Route path={['/dashboard', '/master', '/tahap2', '/tahap4', '/profile', '/static', '/subscription', '/withdraw']}>
              <LeftSidebar>
                <Switch location={location} key={location.pathname}>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}>
                    <PrivateRoute
                      user={user}
                      roles={['Interna', 'Administrator']}
                      path="/dashboard"
                      component={DashboardStatistics}
                    />
                    <PrivateRoute
                      user={user}
                      roles={['Internal', 'Administrator', 'Psikotes']}
                      path="/profile"
                      component={Profile}
                    />
                    <PrivateRoute
                      user={user}
                      roles={["Internal", "Administrator"]}
                      path="/master/user/list"
                      component={UserList}
                    />
                    <PrivateRoute
                      user={user}
                      roles={["Internal", "Administrator"]}
                      path="/master/user/edit"
                      component={UserEdit}
                    />
                    <PrivateRoute
                      user={user}
                      roles={["Internal", "Administrator"]}
                      path="/master/userpsikotes/list"
                      component={UserPsikotesList}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/menu"
                      component={MenuList}
                    />
                    <PrivateRoute
                      user={user}
                      roles={["Internal", "Administrator"]}
                      path="/master/menu/edit"
                      component={MenuEdit}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/gerai"
                      component={GeraiList}
                    />
                    <PrivateRoute
                      user={user}
                      roles={["Internal", "Administrator"]}
                      path="/master/gerai/edit"
                      component={GeraiEdit}
                    />                                       
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/task"
                      component={TaskList}
                    />
                    <PrivateRoute
                      user={user}
                      roles={["Internal", "Administrator"]}
                      path="/master/task/edit"
                      component={TaskEdit}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/voucher"
                      component={VoucherList}
                    />
                    <PrivateRoute
                      user={user}
                      roles={["Internal", "Administrator"]}
                      path="/master/voucher/edit"
                      component={VoucherEdit}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/subscription"
                      component={SubsList}
                    />
                    <PrivateRoute
                      user={user}
                      roles={["Internal", "Administrator"]}
                      path="/subscription/edit"
                      component={SubsEdit}
                    />
                    <PrivateRoute
                      user={user}
                      roles={["Internal", "Administrator"]}
                      path="/withdraw"
                      component={Withdraw}
                    />
                    <PrivateRoute
                      user={user}
                      roles={["Internal", "Administrator"]}
                      path="/master/userpsikotes/edit"
                      component={UserPsikotesEdit}
                    />
                    <PrivateRoute
                      user={user}
                      roles={["Internal", "Administrator"]}
                      path="/master/aspekpsikotes/list"
                      component={AspekPsikotes}
                    />
                    <PrivateRoute
                      user={user}
                      roles={["Internal", "Administrator"]}
                      path="/master/aspekpsikotes/edit"
                      component={AspekPsikotesEdit}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/period"
                      component={Period}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/period/create"
                      component={PeriodCreate}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/period/edit"
                      component={PeriodEdit}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/file"
                      component={File}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/file/create"
                      component={FileCreate}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/file/edit"
                      component={FileEdit}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/pendaftaran"
                      component={Pendaftaran}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/pendaftaran/edit"
                      component={PendaftaranEdit}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/pendaftar"
                      component={Pendaftar}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/pendaftar/edit"
                      component={PendaftarEdit}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/school"
                      component={School}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/school/create"
                      component={SchoolCreate}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/school/edit"
                      component={SchoolEdit}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/school/import"
                      component={SchoolImport}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/syarat"
                      component={SyaratAdmin}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/syarat/edit"
                      component={SyaratAdminEdit}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/tahap2"
                      component={Tahap2}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/tahap2/req"
                      component={Tahap2Req}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/tahap2/edit"
                      component={Tahap2Edit}
                    />
                     <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/tahap4"
                      component={Tahap4}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/tahap4/req"
                      component={Tahap4Req}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/tahap4/edit"
                      component={Tahap4Edit}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/ujian/kategori"
                      component={KategoriUjian}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/ujian/kategori/edit"
                      component={KategoriUjianEdit}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/ujian/setting"
                      component={Ujian}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/ujian/setting/edit"
                      component={UjianEdit}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/ujian/setting/edit/jurusan"
                      component={EditJurusan}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/ujian/soal"
                      component={SoalUjian}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      path="/master/ujian/soal/edit"
                      component={SoalUjianEdit}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/ujian/soal/edit/jawaban"
                      component={EditJawaban}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/static/timeline"
                      component={Timeline}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/static/tatib"
                      component={Tatib}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/static/alamatdokumen"
                      component={AlamatDokumen}
                    />
                    {/* Psikotes Route*/}
                    {/* <PrivateRoute
                      user={user}
                      exact
                      roles={["Psikotes","Internal","Administrator"]}
                      path="/psikotes"
                      component={Psikotes}
                    />       */}
                    {/* <PrivateRoute
                      user={user}
                      exact
                      roles={["Psikotes", "Administrator"]}
                      path="/psikotes/create"
                      component={PsikotesCreate}
                    />    */}
                    {/* <PrivateRoute
                      user={user}
                      exact
                      roles={["Psikotes", "Administrator"]}
                      path="/psikotes/edit"
                      component={PsikotesEdit}
                    />                  */}
                    {/* <PrivateRoute
                      user={user}
                      exact
                      roles={["Psikotes", "Administrator"]}
                      path="/psikotes/import"
                      component={PsikotesImport}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/psikotes/export"
                      component={PsikotesExport}
                    /> */}
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/ujian/hasil"
                      component={HasilUjian}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/ujian/hasil/detail"
                      component={DetailUjian}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/ujian/capture"
                      component={FotoUjian}
                    />
                    {/* <PrivateRoute
                      user={user}
                      exact path="/master/ujian/jurusan"
                      component={JurusanUjian}
                    />
                    <PrivateRoute
                      user={user}
                      exact path="/master/ujian/jurusan/edit"
                      component={JurusanUjianEdit}
                    /> */}
                    {/* <PrivateRoute
                      user={user}
                      exact path="/master/ujian/jawaban"
                      component={JawabanUjian}
                    />
                    <PrivateRoute
                      user={user}
                      exact path="/master/ujian/jawaban/edit"
                      component={JawabanUjianEdit}
                    /> */}
                  </motion.div>
                </Switch>
              </LeftSidebar>
            </Route>

            {/* <Route
              path={[
                '/PageCalendar',
                '/PageChat',
                '/PageProjects',
                '/PageFileManager',
                '/PageProfile'
              ]}>
              <CollapsedSidebar>
                <Switch location={location} key={location.pathname}>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}>
                    <Route path="/PageCalendar" component={PageCalendar} />
                    <Route path="/PageChat" component={PageChat} />
                    <Route path="/PageProjects" component={PageProjects} />
                    <Route path="/PageFileManager" component={PageFileManager} />
                    <Route path="/PageProfile" component={PageProfile} />
                  </motion.div>
                </Switch>
              </CollapsedSidebar>
            </Route> */}

            <Route path={['/login','/register', '/forgotpassword', '/notfound', '/about']}>
              <MinimalLayout>
                <Switch location={location} key={location.pathname}>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}>
                    <Route exact path="/login" component={PageLoginBasic} />
                    <Route exact path="/register" component={PageRegister} />
                    {/* <Route exact path="/login/psikotes" component={PageLoginPsikotes} /> */}
                    <Route
                      path="/forgotpassword"
                      component={PageRecoverBasic}
                    />
                    <Route path="/notfound" component={PageError404} />
                    <Route path="/about/version" component={PageAbout} />
                  </motion.div>
                </Switch>
              </MinimalLayout>
            </Route>
            <Route component={PageError404} />
          </Switch>
        </Suspense>
      </AnimatePresence>
    );
  } else {
    return null;
  }
};

// const mapStateToProps = (state) => ({
//   rProfilePicture: state.General.profilePicture
// });

// const mapDispatchToProps = (dispatch) => ({
//   setProfilePicture: (pp) => dispatch(setProfilePicture(pp))
// });

// export default connect(mapStateToProps, mapDispatchToProps)(Routes);
export default Routes;
