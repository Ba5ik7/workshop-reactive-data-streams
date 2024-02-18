export interface IContent {
  title: string;
  body: string;
  welcomeMessage: string;
  userInfo: {
    emailLabel: string;
    rolesLabel: string;
  };
}

export const content: IContent = {
  title: 'Real World Angular',
  body: 'This is a practical use case for Angular.',
  welcomeMessage: 'Welcome',
  userInfo: {
    emailLabel: 'Email',
    rolesLabel: 'Roles',
  },
};

export interface IUser {
  poid: string;
}

export const user: IUser = {
  poid: '123',
};

export interface IUsersMetadata {
  [key: string]: {
    name: string;
    email: string;
  };
}

export const usersMetadata: IUsersMetadata = {
  [user.poid]: {
    name: 'John Doe',
    email: 'test@test.test',
  },
};

export interface IUserRoles {
  [key: string]: {
    roles: string[];
  };
}

export const userRoles: IUserRoles = {
  [user.poid]: {
    roles: ['admin', 'superuser'],
  },
};
