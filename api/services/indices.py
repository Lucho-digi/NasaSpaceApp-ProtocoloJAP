import numpy as np
import pandas as pd

try:
    from scipy import stats
except Exception as e:
    stats = None


def mean_var(x):
    x = np.asarray(x)
    m = x.mean()
    v = x.var(ddof=1)
    return m, v


def heat_index(T_c, RH):
    T = np.asarray(T_c)
    RH = np.asarray(RH)
    HI = (
        -8.784695
        + 1.61139411 * T
        + 2.338549 * RH
        - 0.14611605 * T * RH
        - 0.012308094 * T**2
        - 0.016424828 * RH**2
        + 0.002211732 * T**2 * RH
        + 0.00072546 * T * RH**2
        - 0.000003582 * T**2 * RH**2
    )
    return HI


def wind_chill(T_c, V_kmh):
    T = np.asarray(T_c)
    V = np.asarray(V_kmh)
    WC = 13.12 + 0.6215 * T - 11.37 * (V**0.16) + 0.3965 * T * (V**0.16)
    return WC


def es_sat(T_c):
    T = np.asarray(T_c)
    es = 0.6108 * np.exp((17.27 * T) / (T + 237.3))
    return es


def delta_slope(T_c):
    T = np.asarray(T_c)
    es = es_sat(T)
    delta = (4098 * es) / ((T + 237.3) ** 2)
    return delta


def psychrometric_constant(pressure_kpa=101.3):
    cp = 1.013e-3
    epsilon = 0.622
    lambda_v = 2.45
    gamma = (cp * pressure_kpa) / (epsilon * lambda_v)
    return gamma


def penman_monteith(Rn, G, T, u2, es, ea, pressure_kpa=101.3):
    Delta = delta_slope(T)
    gamma = psychrometric_constant(pressure_kpa)
    ET0 = (
        0.408 * Delta * (Rn - G) + gamma * (900.0 / (T + 273.0)) * u2 * (es - ea)
    ) / (Delta + gamma * (1.0 + 0.34 * u2))
    return ET0


def balance_hydrico(P, ET0):
    P = np.asarray(P)
    ET0 = np.asarray(ET0)
    return P - ET0


def spi_from_series(precip_series, window=3):
    p = (
        pd.Series(precip_series)
        .rolling(window=window, min_periods=window)
        .sum()
        .dropna()
        .values
    )
    if stats is not None:
        a, loc, scale = stats.gamma.fit(p, floc=0)
        cdf = stats.gamma.cdf(p, a, loc=0, scale=scale)
    spi = stats.norm.ppf(cdf) if stats is not None else np.full_like(p, np.nan)
    return spi, p


def spei_from_series(precip_series, et_series, window=3):
    diff = (
        pd.Series(precip_series)
        .rolling(window=window, min_periods=window)
        .sum()
        .dropna()
        .values
        - pd.Series(et_series)
        .rolling(window=window, min_periods=window)
        .sum()
        .dropna()
        .values
    )
    if stats is not None:
        c, loc, scale = stats.fisk.fit(diff, floc=0)
        cdf = stats.fisk.cdf(diff, c, loc=0, scale=scale)
        spei = stats.norm.ppf(cdf)
    else:
        spei = np.full_like(diff, np.nan)
    return spei, diff


def fit_gev(block_maxima):
    if stats is not None:
        c, loc, scale = stats.genextreme.fit(block_maxima)
        xi = -c
        mu = loc
        sigma = scale
        return xi, mu, sigma
    else:
        return np.nan, np.nan, np.nan


def gev_return_level(xi, mu, sigma, T):
    if np.isnan(xi):
        return np.nan
    term = (-np.log(1 - 1.0 / T)) ** (-xi)
    xT = mu + sigma / xi * (term - 1)
    return xT


def mann_kendall_test(x):
    x = np.asarray(x)
    n = len(x)
    S = 0
    for i in range(n - 1):
        for j in range(i + 1, n):
            if x[j] > x[i]:
                S += 1
            elif x[j] < x[i]:
                S -= 1
    return S


def sen_slope(x):
    x = np.asarray(x)
    n = len(x)
    slopes = []
    for i in range(n - 1):
        for j in range(i + 1, n):
            slopes.append((x[j] - x[i]) / (j - i))
    return np.median(slopes)


def de_martonne(P_mm, T_c):
    P = np.asarray(P_mm)
    T = np.asarray(T_c)
    I = P / (T + 10.0)
    return I


def gdd(Tmax, Tmin, Tbase=10.0, Tmax_cap=30.0):
    Tmax = np.asarray(Tmax)
    Tmin = np.asarray(Tmin)
    Tmean = (Tmax + Tmin) / 2.0
    Teff = np.where(
        Tmean < Tbase, 0.0, np.where(Tmean > Tmax_cap, Tmax_cap - Tbase, Tmean - Tbase)
    )
    return Teff.sum()


def empirical_quantile_mapping(obs, mod):
    obs = np.asarray(obs)
    mod = np.asarray(mod)
    obs_sort = np.sort(obs)
    mod_sort = np.sort(mod)
    ranks = np.searchsorted(mod_sort, mod, side="left") / len(mod_sort)
    mapped = np.interp(ranks, np.linspace(0, 1, len(obs_sort)), obs_sort)
    return mapped


def markov_probability(P_matrix, initial_state_idx, target_state_idx, steps):
    P = np.array(P_matrix)
    pi0 = np.zeros(P.shape[0])
    pi0[initial_state_idx] = 1.0
    Pk = np.linalg.matrix_power(P, steps)
    piH = pi0.dot(Pk)
    return piH[target_state_idx]


def montecarlo_probability(generator_func, classify_func, N=1000):
    hits = 0
    for i in range(N):
        traj = generator_func()
        if classify_func(traj):
            hits += 1
    p = hits / N
    se = np.sqrt(p * (1 - p) / N)
    return p, se


def ar1_simulate(mu, phi, sigma, n):
    x = np.empty(n)
    x[0] = mu
    for t in range(1, n):
        x[t] = mu + phi * (x[t - 1] - mu) + np.random.normal(scale=sigma)
    return x


def precip_markov_simulate(p01, p11, n):
    state = 1 if np.random.rand() < 0.3 else 0
    seq = []
    for _ in range(n):
        seq.append(state)
        if state == 1:
            state = 1 if np.random.rand() < p11 else 0
        else:
            state = 1 if np.random.rand() < p01 else 0
    return np.array(seq)


def sample_trajectory_monthly(n_months=12):
    temp = ar1_simulate(20.0, 0.7, 1.5, n_months)
    prec_flag = precip_markov_simulate(0.1, 0.6, n_months)
    prec = prec_flag * np.random.gamma(shape=2.0, scale=10.0, size=n_months)
    return temp, prec


def classify_koppen_monthly(temp_monthly, prec_monthly):
    T = np.array(temp_monthly)
    P = np.array(prec_monthly)
    if T.min() > 18:
        return "A"
    annualP = P.sum()
    Tann = T.mean()
    Plim = 2 * Tann + 28
    if annualP < 10 * Plim:
        return "B"
    return "C"


def example_montecarlo_probability(N=2000):
    def gen():
        return sample_trajectory_monthly(12)

    def classify(traj):
        temp, prec = traj
        return classify_koppen_monthly(temp, prec) == "B"

    p, se = montecarlo_probability(gen, classify, N=N)
    return p, se


# ------------------------------
# NUEVAS FUNCIONES DE TEST
# ------------------------------
def sample_trajectory_days(n_days=3):
    temp = ar1_simulate(20.0, 0.7, 1.5, n_days)
    prec_flag = precip_markov_simulate(0.1, 0.6, n_days)
    prec = prec_flag * np.random.gamma(shape=2.0, scale=10.0, size=n_days)
    return temp, prec


def classify_koppen_days(temp_daily, prec_daily):
    return classify_koppen_monthly(temp_daily, prec_daily)


def test_simulation_3days(N=1000):
    resultados = {}
    for clima in ["A", "B", "C"]:

        def classify_func(traj):
            temp, prec = traj
            return classify_koppen_days(temp, prec) == clima

        p, se = montecarlo_probability(
            lambda: sample_trajectory_days(3), classify_func, N=N
        )
        resultados[clima] = (p, se)
    return resultados


if __name__ == "__main__":
    p, se = example_montecarlo_probability(2000)
    print("Probabilidad tipo B en 12 meses (MC):", p, "SE:", se)

    resultados3d = test_simulation_3days(2000)
    print("Probabilidades para los próximos 3 días:", resultados3d)
