# Introduction to Probability

## Not-so-bad stuff
Combinatorics, DRVs (Bernoulli, Binomial, Poisson, Geometric, Negative Binomial, Hypergeometric), CRVs (Uniform, Exponential, Normal), expectation, moments, variance.
### Expectation
Often, when calculate expectation of annoying thing, use linearity of expectation (it works in spite of non-independence). So often just create a ton of indicator variables (often identically distributed) and sum over them. (Where each indicator variable's probability is nigh-trivial to compute)

## Marginal and Joint Distributions

## Independence, Covariance, Correlation

## Limit Theorems and Inequalities
### Tailedness Inequalities
|Name|Conditions|Formula|
|-|-|-|
|Markov|RV $X \ge 0$, $\mathbf{E}[X]\in\mathbb{R}$|$P[X\ge a] \le \frac{\mathbf{E}[X]}{a}$|
|Chebyshev|$\mathbf{E}[X],\mathbf{V}[X]\in\mathbb{R}$|$P\left[\left\|X-\mathbf{E}\left[X\right]\right\|\ge a\right]\le\frac{\mathbf{V}[X]}{a^2}$|

### Limit Theorems
Let $\overline{X}_n = \frac{1}{n}\sum\limits_{i=1}^{n}X_i$ where $X_i$ are i.i.d. RVs.

|Name|What|Theorem|
|-|-|-|
|Weak Law of Large Numbers (WLLN)|Converges to|$\lim\limits_{n\to \infty}\mathbf{P}\left[\|\overline{X}_n -\mu\|>\varepsilon\right]=0$|
|Strong Law of Large Numbers (SLLN)|Converges to (non-exam.)|$\mathbf{P}\left[\lim\limits_{n\to\infty}\overline{X}_n=\mu\right]=1$|
|Central Limit Theorem (CLT)|How it converges|$\sqrt{n}\cdot\frac{\overline{X}_n-\mu}{\sigma}\sim N(0,1)$|


*I sometimes call them SLoN/WLoN  
**Technically $\lim\limits_{n\to\infty}F_{Z_n}(a)=\Phi(a)$

