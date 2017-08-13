declare module 'hippie' {
  interface Hippie {
    get(s: string): any;
    post(s: string): any;
    del(s: string): any;
  }

  export default Hippie;
}
