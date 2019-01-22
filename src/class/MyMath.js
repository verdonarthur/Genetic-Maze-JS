export class MyMath {
    static random(max) {
        return Math.random() * max;
    }

    static distBetweenTwoPoints(x1, y1, x2, y2) {
        let a = x1 - x2;
        let b = y1 - y2;

        if(a==0 && b==0)
            return 0

        return Math.sqrt(a * a + b * b);
    }
}