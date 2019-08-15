export default {
  name: 'user',
  path: 'user',
  component: () => import('@/views/user/index'),
  children: [
    {
      name: 'user-list',
      path: 'user-list',
      component: () => import('@/views/user/user-list/index'),
    },
    {
      name: 'play-times',
      path: 'play-times',
      component: () => import('@/views/user/play-times/index'),
    },
    // {
    //   name: 'MemberSignIn',
    //   path: 'MemberSignIn',
    //   component: () => import('@/views/user/MemberSignIn/index'),
    // }
  ],
};
