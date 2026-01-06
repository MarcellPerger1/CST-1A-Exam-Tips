# Graphics
...

## Transformations
### Normal vectors
Remember: for column vectors $A$ and $B$, $A\cdot B=A^TB$.

A normal vector $N$ will be perpendicular (by definition) to a tangent vector $V$ (so $N\cdot V=N^TV=0$).  
When $V$ is transformed by $M$ to become $MV$, $N$ must be transformed by a different transformation $G$ such that $GN$ is perpendicular to $MV$, so $\left(GN\right)\cdot\left(MV\right)=\left(GN\right)^TMV=0$.  
Hence, as $(AB)^T=B^TA^T$, $N^TG^TMV=0$. But from before, we also have $N^TV=0$.  
Therefore,
$$
N^TG^TMV=N^TV\\
G^TM=I\\
G=(M^{-1})^T
$$
