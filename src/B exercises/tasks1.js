//3.a
async function perfAsyncTasks(params) {
  const [A, B] = await Promise.all([runA, runB]);
  const C = await runC_using_A();
  const D = await runD_using_B_and_C();
  const E = await runE_using_D();
}
