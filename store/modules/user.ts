import { VuexModule, Module, Action, Mutation, getModule } from 'nuxt-property-decorator';
import { getToken, setToken, removeToken } from '@/utils/cookies';
import { IUserState } from '@/constants/app.interface';
import { UserRole } from '@/constants/app.type';
import store from '@/store';
@Module({ name: 'user', dynamic: true, store })
class User extends VuexModule implements IUserState {
  public token!: string;
  public name!: string;
  public avatar!: string;
  public role!: UserRole;
  public email!: string;

  // @Mutation
  // private setToken(token: string) {
  //   this.token = token;
  // }

  // @Mutation
  // private setName(name: string) {
  //   this.name = name;
  // }

  // @Mutation
  // private setAvatar(avatar: string) {
  //   this.avatar = avatar;
  // }

  // @Mutation
  // private setRole(role: UserRole) {
  //   this.role = role;
  // }

  // @Mutation
  // private setEmail(email: string) {
  //   this.email = email;
  // }

  // @Action
  // public resetToken() {
  //   removeToken();
  //   this.setToken('');
  //   this.setRole(null);
  // }
}

export default getModule(User);
