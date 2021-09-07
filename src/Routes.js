/*eslint-disable*/
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
// import PageAbout from './pages/PageAbout';

const DashboardStatistics = lazy(() => import('./pages/DashboardStatistics'));
const PageLoginBasic = lazy(() => import('./pages/PageLoginBasic'));
const PageRegister = lazy(() => import('./components/PageRegister'))
const PageRecoverBasic = lazy(() => import('./pages/PageRecoverBasic'));
const Profile = lazy(() => import('./pages/Profile'));
const Withdraw = lazy(() => import('./pages/Withdraw/withdraw'));
const GeraiList = lazy(() => import('./pages/Master/Gerai'));
const GeraiEdit = lazy(() => import('./pages/Master/Gerai/edit'));
const CustomerList = lazy(() => import('./pages/Master/Customer'));
const CustomerEdit = lazy(() => import('./pages/Master/Customer/edit'));
const SubsList = lazy(() => import('./pages/Subscription'));
const SubsEdit = lazy(() => import('./pages/Subscription/edit'));
const GeraiReport = lazy(() => import('./pages/Laporan/Gerai/index'));
const GeraiReportComplain = lazy(() => import('./pages/Laporan/Gerai/complain'));
const GeraiReportOrder = lazy(() => import('./pages/Laporan/Gerai/order'));
const GeraiReportTask = lazy(() => import('./pages/Laporan/Gerai/task'));
const GeraiReportTaskDetail = lazy(() => import('./pages/Laporan/Gerai/taskDetail'));
// const TaskList = lazy(() => import('./pages/Master/Task'));
// const TaskEdit = lazy(() => import('./pages/Master/Task/edit'));
// const VoucherList = lazy(() => import('./pages/Master/Voucher'));
// const VoucherEdit = lazy(() => import('./pages/Master/Voucher/edit'));

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

            <Route path={['/dashboard', '/master', '/profile', '/subscription', '/withdraw','/laporan']}>
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
                      path="/master/customer"
                      component={CustomerList}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/master/customer/edit"
                      component={CustomerEdit}
                    />
                    {/* <PrivateRoute
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
                    /> */}
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
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/laporan/gerai"
                      component={GeraiReport}
                    />
                    <PrivateRoute
                      user={user}
                      roles={["Internal", "Administrator"]}
                      path="/laporan/gerai/order"
                      component={GeraiReportOrder}
                    />
                    <PrivateRoute
                      user={user}
                      exact
                      roles={["Internal", "Administrator"]}
                      path="/laporan/gerai/task"
                      component={GeraiReportTask}
                    />
                    <PrivateRoute
                      user={user}
                      roles={["Internal", "Administrator"]}
                      path="/laporan/gerai/complain"
                      component={GeraiReportComplain}
                    />
                    <PrivateRoute
                      user={user}
                      roles={["Internal", "Administrator"]}
                      path="/laporan/gerai/task/detail"
                      component={GeraiReportTaskDetail}
                    />
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
                    {/* <Route path="/about/version" component={PageAbout} /> */}
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
