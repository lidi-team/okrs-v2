import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import { getTokenCookies, setTokenCookies, removeTokenCookies } from '@/utils/cookies';
import { AuthState, LoginDTO } from '@/constants/app.interface';
import { UserRole } from '@/constants/app.type';
import store from '@/store';
import AuthRepository from '@/repositories/AuthRepository';

@Module({ stateFactory: true, dynamic: true, store })
class AuthModule extends VuexModule implements AuthState {
  public token: string | undefined = getTokenCookies();
  public role: UserRole = null;

  @Mutation
  private setToken(token: string) {
    this.token = token;
  }

  @Mutation
  private setRole(role: UserRole) {
    this.role = role;
  }

  @Action
  public resetToken() {
    removeTokenCookies();
    setTokenCookies('');
    this.setRole(null);
  }

  @Action
  public async login({ email, password }: LoginDTO): Promise<void> {
    email = email.trim();
    const { data } = await AuthRepository.login({ email, password });
    setTokenCookies(data.token);
    this.setToken(data.token);
  }

  @Action
  public async sendMailToResetPassword(email: string): Promise<void> {
    email = email.trim();
    const { status } = await AuthRepository.sendMailToResetPassword(email);
  }
}

export default getModule(AuthModule);
