export class RandomStringGenerator {
  public static readonly CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  public static generate(length: number) {
    let result = '';

    for (var i = 0; i < length; i++) {
      result += RandomStringGenerator.CHARACTERS
        .charAt(Math.floor(Math.random() * RandomStringGenerator.CHARACTERS.length));
    }

    return result;
  }
}