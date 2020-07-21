import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import { getTokenCookies, setTokenCookies, removeTokenCookies } from '@/utils/cookies';
import { AuthState, LoginDTO, UserState } from '@/constants/app.interface';
import { UserRole } from '@/constants/app.type';
import store from '@/store';
import AuthRepository from '@/repositories/AuthRepository';

@Module({ stateFactory: true, dynamic: true, store })
class UserModule extends VuexModule implements UserState {
  public fullName!: string;

  @Mutation
  private setFullName(fullName: string) {
    this.fullName = fullName;
  }
}

export default getModule(UserModule);
